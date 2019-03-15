<template>
  <v-layout class="full-height" row pa-3>
    <v-flex xs3 class="full-height" pr-2>
      <v-card height="100%" dark>
        <v-toolbar>
          <v-toolbar-title>아이디 <v-badge class="blue--text">{{ ids.length }}</v-badge></v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <input ref="image" type="file" style="display: none" @change="onFilePicked">
            <v-btn class="yellow--text" flat @click="pickFile">추가</v-btn>
            <v-btn class="yellow--text" flat @click="copyArray('ids')">복사</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-toolbar>
          <v-toolbar-title>아이디 + 비밀번호 <v-badge class="blue--text">{{ idpw.length }}</v-badge></v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <input ref="image2" type="file" style="display: none" @change="onFilePicked2">
            <v-btn class="yellow--text" flat @click="pickFile2">추가</v-btn>
            <v-btn class="yellow--text" flat @click="copyArray('idpw')">복사</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card>
    </v-flex>
    <v-flex xs3 pr-2>
      <v-card height="100%" dark>
        <v-toolbar>
          <v-toolbar-title>제목</v-toolbar-title>
        </v-toolbar>
        <v-textarea v-model="title" label="제목" rows="5" no-resize solo-inverted hide-details/>
        <v-toolbar>
          <v-toolbar-title>내용</v-toolbar-title>
        </v-toolbar>
        <v-textarea v-model="html" label="내용" rows="15" no-resize solo-inverted hide-details/>
      </v-card>
    </v-flex>
    <v-flex xs6>
      <v-layout column fill-height>
        <v-flex>
          <v-card dark>
            <v-layout row style="padding: 13px 0;">
              <v-flex xs3 text-xs-center>
                <span class="subheader">보낸수: <span class="green--text">{{ statis.send | cur }}개</span></span>
              </v-flex>
              <v-flex xs3 text-xs-center>
                <span class="subheader">실패수: <span class="pink--text">{{ statis.failure | cur }}개</span></span>
              </v-flex>
              <v-flex xs3 text-xs-center>
                <span class="subheader">총개수: <span class="blue--text">{{ firstLength | cur }}개</span></span>
              </v-flex>
              <v-flex xs3 text-xs-center>
                <span class="subheader">페센트: <span class="orange--text">{{ statis.percent }}%</span></span>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex style="height: calc(100% - 65px)">
          <v-card dark>
            <v-btn v-if="btn" class="center black--text" fab dark small absolute top right color="yellow" @click="sendEmail">
              <v-icon dark>play_arrow</v-icon>
            </v-btn>
            <v-btn v-else class="center black--text" fab dark small absolute top right color="yellow" @click="stopSend">
              <v-icon dark>stop</v-icon>
            </v-btn>
            <v-data-table :headers="headers" :items="datas" class="fixed-header v-table__overflow" style="max-height: calc(100vh - 144px); backface-visibility: hidden;" hide-actions>
              <template slot="items" slot-scope="props">
                <td class="text-xs-center">{{ props.item.to }}</td>
                <td class="text-xs-center">{{ props.item.from }}</td>
                <td class="text-xs-center">{{ props.item.title }}</td>
                <td class="text-xs-center">{{ props.item.err }}</td>
                <td class="text-xs-center"><span :class="{ active: !props.item.is }" class="is-mail"/></td>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  filters: {
    cur(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  data: () => ({
    ids: ['jinaishan0517'],
    idpw: [],
    fids: [],
    id535: [],
    datas: [],
    firstLength: 0,
    leng: 10,
    idpwText: null,
    imageName: '',
    imageUrl: '',
    imageFile: '',
    imageName2: '',
    imageUrl2: '',
    imageFile2: '',
    play: true,
    btn: true,
    dian: ['.', ',', '，', '．', '、', '。', '‥', '…', '¸', '˛', '„'],
    title: null,
    titles: [],
    link: [
      'http://po.do/Qmw',
      'http://bitly.kr/rxkKX',
      'https://bit.ly/2C1WfUI',
      'https://hoy.kr/Gewdw',
      'http://na.to/cgQ ',
      'http://reurl.kr/132242EANO'
    ],
    html: null,
    htmls: null,
    statis: { send: 0, failure: 0, percent: 0 },
    head: [
      { text: '보낸수', align: 'center', sortable: false, value: 'send' },
      { text: '실패수', align: 'center', sortable: false, value: 'failure' },
      { text: '페센트', align: 'center', sortable: false, value: 'percent' }
    ],
    headers: [
      { text: '보낸아이디', align: 'center', sortable: false, value: 'id', width: 100 },
      { text: '받은아이디', align: 'center', sortable: false, value: 'sid', width: 100 },
      { text: '타이틀', align: 'center', sortable: false, value: 'title' },
      { text: '애러코드', align: 'center', sortable: false, value: 'err', width: 100 },
      { text: '성공여부', align: 'center', sortable: false, value: 'is', width: 100 }
    ]
  }),
  created() {
  },
  methods: {
    pickFile() {
      this.$refs.image.click()
    },
    pickFile2() {
      this.$refs.image2.click()
    },
    onFilePicked(e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          this.readTextFile(fr.result)
          this.imageFile = files[0]
        })
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageUrl = ''
      }
    },
    onFilePicked2(e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName2 = files[0].name
        if (this.imageName2.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageUrl2 = fr.result
          this.readTextFile2(fr.result)
          this.imageFile2 = files[0]
        })
      } else {
        this.imageName2 = ''
        this.imageFile2 = ''
        this.imageUrl2 = ''
      }
    },
    readTextFile(file) {
      const rawFile = new XMLHttpRequest()
      rawFile.open('GET', file, true)
      rawFile.onreadystatechange = () => {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status === 0) {
            const text = rawFile.responseText
            this.ids = _.uniq(text.split(/[\r\n]+/))
            this.firstLength = _.uniq(text.split(/[\r\n]+/)).length
          }
        }
      }
      rawFile.send(null)
    },
    readTextFile2(file) {
      const rawFile = new XMLHttpRequest()
      rawFile.open('GET', file, true)
      rawFile.onreadystatechange = () => {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status === 0) {
            const text = rawFile.responseText
            const ntext = _.compact(text.split(/[\r\n]+/))
            this.fids = ntext
            const arr = []
            ntext.forEach(function(line) {
              // Clean up whitespace/comments, and split into fields
              const auth = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/)
              const id = auth[0]
              const pw = auth[1]
              arr.push({ id, pw })
            })
            this.idpw = arr
          }
        }
      }
      rawFile.send(null)
    },
    random(num) {
      return Math.floor((Math.random() * num))
    },
    async sendEmail() {
      if (this.ids.length === 0 && this.idpw.length === 0) {
        alert('보낼아이디 비번을 넣어주세요.')
        return
      }
      this.btn = false
      for (const a in this.ids) {
        for (const b in this.idpw) {
          if (!this.play) return
          const rIdpw = Math.floor((Math.random() * this.idpw.length))
          const rLink = Math.floor((Math.random() * this.link.length))
          const rTitle = Math.floor((Math.random() * this.title.length))
          var html = `<div style="margin: 0 auto; width: 300px; height: 140px; display: block; border-radius: 2px; position: relative; transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1); background-color: #448AFF; box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12); text-decoration: none; padding: 10px; color: #fff; position: relative; font-size: 15px; font-family: '나눔고딕'">
          강원랜드 사이트 추천합니다.<br>
          <a href="$" style="color: yellow; display: block; padding-top: 20px; text-align: center;">접속 사/이트</a>
          </div>`
          const htmlLen = html.split('@').length
          for (let index = 0; index < htmlLen; index++) {
            const ran = Math.floor((Math.random() * this.sText.split(' ').length))
            const sTxt = this.sText.split(' ')[ran]
            html = html.replace('@', sTxt)
          }
          const v = this.idpw[rIdpw]
          html = html.replace('$', this.link[rLink])
          let params = {}
          if (a % 100 === 0) {
            params = {
              id: v.id,
              pw: v.pw,
              to: 'jinaishan0517',
              html: html,
              title: this.title[rTitle].replace('@', 'jinaishan0517')
            }
          } else {
            params = {
              id: v.id,
              pw: v.pw,
              to: this.ids[a],
              html: html,
              title: this.title[rTitle].replace('@', this.ids[a])
            }
          }
          const info = await axios.post('http://localhost:3000/email', params)
          if (info.status === 200) {
            this.datas.unshift({
              to: info.data.envelope.from.replace('@daum.net', ''),
              from: info.data.envelope.to[0].replace('@naver.com', ''),
              title: params.title,
              err: null,
              is: true
            })
            this.statis.send += 1
            this.statis.percent = Math.floor((this.statis.send / this.ids.length) * 100)
            this.ids.splice(a, 1)
            this.idpw.splice(b, 1)
            break
          } else {
            this.statis.failure += 1
            if (info.data.responseCode === 535) {
              this.idpw.splice(b, 1)
              this.id535.push(params.id)
            }
            this.datas.unshift({
              to: params.id,
              from: params.to,
              err: info.data.responseCode,
              title: params.title,
              is: false
            })
          }
        }
      }
      this.btn = true
      this.play = true
    },
    stopSend() {
      this.play = false
      this.btn = true
    },
    copyArray(val) {
      const t = document.createElement('textarea')
      document.body.appendChild(t)
      if (val === 'ids') {
        const text = String(this.ids.toString().split(','))
        t.value = text.replace(/,/gi, '\n')
      } else {
        this.idpw.map(user => {
          t.value += `${user.id} ${user.pw} \n`
        })
      }
      t.select()
      document.execCommand('copy')
      document.body.removeChild(t)
    }
  }
}
</script>
