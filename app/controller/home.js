'use strict'
const rp = require('request-promise')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const encoding = require('encoding')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const Controller = require('egg').Controller

class HomeController extends Controller {
    async index() {
        const { ctx } = this
        const result = {
            error: '',
            data: [],
        }

        let html = await rp('http://top.baidu.com/buzz?b=1', {
            timeout: 5000,
            gzip: true,
            encoding: null,
        }).catch(e => {
            result.error = e
        })

        html = encoding.convert(html, 'utf-8', 'gb2312').toString('utf-8')

        const $ = cheerio.load(html)
        const topicList = $('.keyword a.list-title')
        topicList.each((i, el) => {
            result.data[i] = $(el).text()
        })

        ctx.body = result
    }
}

module.exports = HomeController
