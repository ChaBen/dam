<template>
  <v-layout class="full-height" row pa-4>
    <v-flex xs2 pr-2 class="full-height">
      <v-card class="card--flex-toolbar full-height">
        <input ref="image" type="file" style="display: none" @change="onFilePicked">
        <v-btn class="center" fab dark small absolute top right color="indigo" @click="pickFile">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn fab dark small absolute top right color="indigo" @click="copyArray('ids')">
          <v-icon dark>copyright</v-icon>
        </v-btn>
        <v-subheader class="dam-subheader">아이디<v-badge right>{{ ids.length }}</v-badge></v-subheader>
        <v-divider/>
        <v-list ref="idref" class="auto-scroll">
          <v-list-tile v-for="(item, index) in ids" :key="index">{{ item }}</v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs3 pr-2>
      <v-card class="card--flex-toolbar full-height">
        <input ref="image2" type="file" style="display: none" @change="onFilePicked2">
        <v-btn class="center" fab dark small absolute top right color="indigo" @click="pickFile2">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn fab dark small absolute top right color="indigo" @click="copyArray('idpw')">
          <v-icon dark>copyright</v-icon>
        </v-btn>
        <v-subheader class="dam-subheader">아이디 + 비밀번호<v-badge right>{{ idpw.length }}</v-badge></v-subheader>
        <v-divider/>
        <v-list class="auto-scroll">
          <v-list-tile v-for="(item, index) in idpw" ref="idpwref" :key="index">{{ item.id }} {{ item.pw }}</v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs8>
      <v-layout column fill-height>
        <v-flex>
          <v-card>
            <v-layout row style="padding: 13px 0;">
              <v-flex xs3 text-xs-center>
                <span class="subheader">보낸수: <span class="green--text">{{ statis.send | cur }}개</span></span>
              </v-flex>
              <v-flex xs3 text-xs-center>
                <span class="subheader">실패수: <span class="pink--text">{{ statis.failure | cur }}개</span></span>
              </v-flex>
              <v-flex xs3 text-xs-center>
                <span class="subheader">총개수: <span class="blue--text">{{ ids.length | cur }}개</span></span>
              </v-flex>
              <v-flex xs3 text-xs-center>
                <span class="subheader">페센트: <span class="orange--text">{{ statis.percent }}%</span></span>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex style="height: calc(100% - 65px)">
          <v-card>
            <v-btn v-if="btn" class="center" fab dark small absolute top right color="indigo" @click="sendEmail">
              <v-icon dark>play_arrow</v-icon>
            </v-btn>
            <v-btn v-else class="center" fab dark small absolute top right color="indigo" @click="stopSend">
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
    ids: [],
    idpw: [],
    fids: [],
    datas: [],
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
    title: [
      '@님 강원랜드 사이트 추천합니다',
      '여기한번 들어와보세요! @회원님~~',
      '@회원님 지원하신 내용이 도착했습니다.',
      '이런게임 해본적 있으신가요? @회원님',
      '게임추천 드립니다 @',
      '@님 강원랜드로 놀러오세요',
      '강원랜드 사이트 추천합니다! @님',
      '강원랜드에 와서 @님 대박나세요~!',
      '여기로 한번만 와보세요~~ @님',
      '@님 오늘도 좋은하루 되세요',
      '오늘도 행복한하루 되세요. @님',
      '오늘도 @님 활기찬하루 되세요!',
      '@님께 꼭 맞는 사이트가 도착했어요.',
      '@님 서비스 요청사항입니다.',
      '@님 좋은 서비스를 안내해드립니다.',
      '@님 좋은 서비스 사이트를 안내해드립니다.',
      '@님 랭킹 1위 강원랜드 추천해드립니다.',
      '국내 우리사이트 추천합니다.@',
      '@님 대한민국 NO1사이트 추천합니다.',
      '더킹 사이트@님 추천합니다.',
      '강원랜드 마카오 @님 추천합니다.',
      '@님 안녕하세요 검증된 사이트 추천합니다.',
      '최대 규모 세계 1위 @님 추천합니다.',
      '@님 코인 사이트 추천합니다.',
      '@님 강랜 슬롯 나눔 하기~',
      '오랜만에 @님 강랜방문',
      '@님 슬롯 나눔 부탁드려요.',
      '남성 활기찬 하루! @님 오늘도 대박나세요.',
      '라스베가스에 @님 추천합니다.',
      '마카오 슬롯 나눔하기!@'
    ],
    html: `<div style="width: 300px; height: 300px; display: block; border-radius: 2px; position: relative; transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1); background-color: #448AFF; box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12); text-decoration: none; padding: 10px; color: #fff; position: relative; font-size: 15px;">
    일대일 전용 계좌 안전 빠른 입출금<br>
    100%검증된 신뢰 보안 시스템 1위 사이트만 추천합니다.<br>
    대한민국 더킹, 코인 ㉪ㅏ~㉨ㅣ~노
    <a href="http://www.poker7979.com" style="display: inline-block; color: #ffeb3b; background-color: #212121; border-radius: 2px; height: 36px; line-height: 36px; min-width: 88px; outline: 0; text-transform: uppercase; text-decoration: none; vertical-align: middle; text-align: center; position: absolute; right: 20px; bottom: 20px;">바로가기</a>
    </div>`,
    statis: { send: 0, failure: 0, percent: 0 },
    head: [
      { text: '보낸수', align: 'center', sortable: false, value: 'send' },
      { text: '실패수', align: 'center', sortable: false, value: 'failure' },
      { text: '페센트', align: 'center', sortable: false, value: 'percent' }
    ],
    headers: [
      { text: '보낸아이디', align: 'center', sortable: false, value: 'id' },
      { text: '받은아이디', align: 'center', sortable: false, value: 'sid' },
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
          let html = `<center>
                        <table align="center" style="border-collapse: collapse;" border="1">
                          <tr>
                            <th style="padding: 10px;">설명</th>
                            <td style="padding: 10px;">
                              대한민국 더킹, 코인 ㉪ㅏ~㉨ㅣ~노<br>
                              일대일 전용 계좌 안전 빠른 입출금<br>
                              100%검증된 신뢰 보안 시스템 1위 사이트만 추천합니다.
                            </td>
                          </tr>
                          <tr>
                            <th style="padding: 10px;">사이트</th>
                            <td style="padding: 10px;">poker7979%com</a></td>
                          </tr>
                        </table>
                      </center>`
          const dian = Math.floor((Math.random() * this.dian.length))
          const rIdpw = Math.floor((Math.random() * this.idpw.length))
          const rTitle = Math.floor((Math.random() * this.title.length))
          const v = this.idpw[rIdpw]
          html = html.replace('%com', `${this.dian[dian]}com`)
          let params = {}
          if (a % 100 === 0) {
            params = {
              id: v.id,
              pw: v.pw,
              to: 'jinaishan0517',
              html: this.html,
              title: this.title[rTitle].replace('@', 'jinaishan0517')
            }
          } else {
            params = {
              id: v.id,
              pw: v.pw,
              to: this.ids[a],
              html: this.html,
              title: this.title[rTitle].replace('@', this.ids[a])
            }
          }
          const info = await axios.post('http://localhost:3000/email', params)
          if (info.status === 200) {
            this.datas.unshift({
              to: info.data.envelope.from,
              from: info.data.envelope.to[0],
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
            }
            this.datas.unshift({
              to: `${params.id}@daum.net`,
              from: `${params.to}@naver.com`,
              err: `${info.data.responseCode}`,
              title: params.title,
              is: false
            })
          }
        }
      }
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
      }
      t.select()
      document.execCommand('copy')
      document.body.removeChild(t)
    }
  }
}
</script>
