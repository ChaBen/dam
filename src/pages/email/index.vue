<template>
  <v-layout class="full-height" row pa-4>
    <v-flex xs2 pr-2 class="full-height">
      <v-card class="card--flex-toolbar full-height">
        <!-- <v-toolbar card prominent>
          <input ref="image" type="file" style="display: none" @change="onFilePicked">
          <v-btn fab dark small color="indigo" @click="pickFile">
            <v-icon dark>add</v-icon>
          </v-btn>
        </v-toolbar> -->
        <input ref="image" type="file" style="display: none" @change="onFilePicked">
        <v-btn class="center" fab dark small absolute top right color="indigo" @click="pickFile">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-subheader class="dam-subheader">아이디<v-badge right>{{ ids.length }}</v-badge></v-subheader>
        <v-divider/>
        <v-list class="auto-scroll">
          <v-list-tile v-for="(item, index) in ids" :key="index">{{ item }}</v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs2 pr-2>
      <v-card class="card--flex-toolbar full-height">
        <input ref="image2" type="file" style="display: none" @change="onFilePicked2">
        <v-btn class="center" fab dark small absolute top right color="indigo" @click="pickFile2">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-subheader class="dam-subheader">아이디 + 비밀번호<v-badge right>{{ idpw.length }}</v-badge></v-subheader>
        <v-divider/>
        <v-list class="auto-scroll">
          <v-list-tile v-for="(item, index) in idpw" :key="index">{{ item.id }} {{ item.pw }}</v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs3 pr-2 class="relative">
      <div class="scroll">
        <v-btn v-if="play" class="center" fab dark small absolute top right color="indigo" @click="stopSend">
          <v-icon dark>stop</v-icon>
        </v-btn>
        <v-btn v-else class="center" fab dark small absolute top right color="indigo" @click="sendEmail">
          <v-icon dark>play_arrow</v-icon>
        </v-btn>
        <v-card v-for="card in cards" :key="card.color" :color="card.color" class="dam-email">
          <v-card-title><v-text-field v-model="card.title" label="email title" solo/></v-card-title>
          <v-card-text>
            <v-textarea v-model="card.html" placeholder="email text" solo full-widthsingle-line no-resize/>
          </v-card-text>
        </v-card>
      </div>
    </v-flex>
    <v-flex xs5>
      <v-data-table :headers="headers" :items="datas" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.index+1 }}</td>
          <td class="text-xs-center">{{ props.item.to }}</td>
          <td class="text-xs-center">{{ props.item.from }}</td>
          <td class="text-xs-center">{{ props.item.err }}</td>
          <td class="text-xs-center"><span :class="{ active: !props.item.is }" class="is-mail"/></td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    ids: [],
    idpw: [],
    datas: [],
    imageName: '',
    imageUrl: '',
    imageFile: '',
    imageName2: '',
    imageUrl2: '',
    imageFile2: '',
    play: false,
    cards: [
      { color: 'blue', title: '대`한~민국 NO1 ㉪ㅏ ,.㉨ㅣ., 노', html: `<div style="font-size: 20px;">안@전 빠^른 일*대일 전용 (계)=좌 입+{출}<br><br>신!뢰 보~안 시—스템 1·위  검#증/된 우리 계열 더-킹<br><br></div><a style="font-size:20px; color: #e91e63;" href="http://www.abcmm999.com">대한~민국 NO1 ㉪ㅏ ,.㉨ㅣ., 노</a>` },
      { color: 'pink', title: '', html: '' },
      { color: 'purple', title: '', html: '' }
    ],
    headers: [
      { text: '개수', align: 'center', sortable: true, value: 'index' },
      { text: '보낸아이디', align: 'center', sortable: false, value: 'id' },
      { text: '받은아이디', align: 'center', sortable: false, value: 'sid' },
      { text: '애러코드', align: 'center', sortable: false, value: 'err' },
      { text: '성공여부', align: 'center', sortable: false, value: 'is' }
    ]
  }),
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
            this.ids = text.split('\n')
            console.log(this)
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
    sendEmail() {
      this.play = true
      if (this.play) {
        this.ids.map(id => {
          const idNum = this.random(this.idpw.length)
          const sid = this.idpw[idNum]
          const params = {
            id: sid.id,
            pw: sid.pw,
            to: id,
            html: this.cards[0].html,
            title: this.cards[0].title
          }
          axios.post('http://localhost:3000/email', params).then(res => {
            const info = res.data.info
            this.datas.push({
              to: info.envelope.from,
              from: info.envelope.to[0],
              err: null,
              is: true
            })
            this.ids.splice(0, 1)
          }).catch(err => {
            console.log(err)
          })
        })
        this.play = false
      }
    },
    stopSend() {
      this.play = false
    }
  }
}
</script>
