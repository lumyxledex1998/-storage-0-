const path = require('node:path')
const fs = require('fs').promises
const { getContentType } = require('baileys')
const { Boom } = require('@hapi/boom')
const { DATABASE_DIR } = require('../config')

const DB_PATH = path.join(`${DATABASE_DIR}/muted.json`)
const DELETE_TIMEOUT = 5000
const MAX_RETRIES = 3

function normalizeJid(jid) {
    if (!jid) return null
    return jid.replace(/[^0-9]/g, '').split('@')[0] + '@s.whatsapp.net'
}

async function loadDatabase() {
    try {
        await fs.access(DB_PATH)
        const data = await fs.readFile(DB_PATH, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        if (error.code === 'ENOENT') return {}
        throw error
    }
}

async function checkMutedUser({ socket, webMessage, developerDebug = false }) {
    try {
        const { key, message } = webMessage

        if (!key?.remoteJid || !key.remoteJid.endsWith('@g.us') || key.fromMe) {
            return false
        }

        const groupId = key.remoteJid
        const senderJid = key.participant || key.remoteJid
        const messageId = key.id
        const normalizedSender = normalizeJid(senderJid)

        const db = await loadDatabase()
        const mutedList = db[groupId] || []

        const isMuted = mutedList.some(jid => normalizeJid(jid) === normalizedSender)
        if (!isMuted) return false

        const deleteKey = {
            remoteJid: groupId,
            fromMe: false,
            id: messageId,
            participant: senderJid
        }

        let retryCount = 0
        let lastError = null

        while (retryCount < MAX_RETRIES) {
            try {
                await socket.sendMessage(groupId, { delete: deleteKey })
                
                if (developerDebug) {
                    const contentType = getContentType(message) || 'unknown'
                    console.log(`🗑️ [${contentType.toUpperCase()}] Mensagem de @${normalizedSender.split('@')[0]} apagada`)
                }

                return true
            } catch (error) {
                lastError = error
                retryCount++
                if (retryCount < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
                }
            }
        }

        if (lastError instanceof Boom) {
            if (lastError.output.statusCode === 404) {
                console.error(`🔍 Mensagem não encontrada (${messageId})`)
            } else if (lastError.output.statusCode === 403) {
                console.error(`⚠️ Bot não é admin em ${groupId}`)
            } else {
                console.error(`❌ Erro ao apagar mensagem: ${lastError.message}`)
            }
        } else if (lastError) {
            console.error(`❌ Erro desconhecido: ${lastError.message}`)
        }

        return false
    } catch (error) {
        console.error('💥 Erro crítico:', error)
        return false
    }
}

module.exports = { checkMutedUser, normalizeJid }