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
            <v-layout row pa-3>
              <v-flex xs3 text-xs-center>
                <span class="title">보낸수: <span class="green--text">{{ statis.send | cur }}개</span></span>
              </v-flex>
              <v-flex xs3 text-xs-center>
                <span class="title">실패수: <span class="pink--text">{{ statis.failure | cur }}개</span></span>
              </v-flex>
              <v-flex xs3 text-xs-center>
                <span class="title">총개수: <span class="blue--text">{{ ids.length | cur }}개</span></span>
              </v-flex>
              <v-flex xs3 text-xs-center>
                <span class="title">페센트: <span class="orange--text">{{ statis.percent }}%</span></span>
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
                <td class="text-xs-center">{{ props.index+1 }}</td>
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
    sText: '~ ! # $ % ^ & * \ + = ` | ( ) [ ] { } : ; - _ - ＃ ＆ ＆ ＠ § ※ ☆ ★ ○ ● ◎ ◇ ◆ □ ■ △ ▲ ▽ ▼ → ← ← ↑ ↓ ↔ 〓 ◁ ◀ ▷ ▶ ♤ ♠ ♡ ♥ ♧ ♣ ⊙ ◈ ▣ ◐  ◑ ▒ ▤ ▥ ▨ ▧ ▦ ▩ ♨ ☏ ☎ ☜ ☞ ¶ † ‡ ↕ ↗ ↙ ↖ ↘ ♭ ♩ ♪ ♬ ㉿ ㈜ № ㏇ ™ ㏂ ㏘ ℡ ® ª º ─ │ ┌ ┐ ┘ └ ├ ┬ ┤ ┴ ┼ ━ ┃ ┏ ┓ ┛ ┗ ┣ ┳ ┫ ┻ ╋ ┠ ┯ ┨ ┷ ┿ ┝ ┰ ┥ ┸ ╂ ┒ ┑ ┚ ┙ ┖ ┕ ┎ ┍ ┞ ┟ ┡ ┢ ┦ ┧ ┩ ┪ ┭ ┮ ┱ ┲ ┵ ┶ ┹ ┺ ┽ ┾ ╀ ╁ ╃ ╄ ╅ ╆ ╇ ╈ ╉ ╊ ＋ － ＜ ＝ ＞ ± × ÷ ≠ ≤ ≥ ∞ ∴ ♂ ♀ ∠ ⊥ ⌒ ∂ ∇ ≡ ≒ ≪ ≫ √ ∽ ∝ ∵ ∫ ∬ ∈ ∋ ⊆ ⊇ ⊂ ⊃ ∪ ∩ ∧ ∨ ￢ ⇒ ⇔ ∀ ∃ ∮ ∑ ∏ ！ ＇ ， ． ／ ： ； ？ ＾ ＿ ｀ ｜ ￣ 、 。 · ‥ … ¨ 〃 ­ ― ∥ ＼ ∼ ´ ～ ˇ ˘ ˝ ˚ ˙ ¸ ˛ ¡ ¿ ː ＂ ” 〔 〕 ｛ ｝ ‘ ’ “ ” 〔 〕 〈 〉 《 》 「 」 『 』 【 】 ㉠ ㉡ ㉢ ㉣ ㉤ ㉥ ㉦ ㉧ ㉨ ㉩ ㉪ ㉫ ㉬ ㉭ ㉮ ㉯ ㉰ ㉱ ㉲ ㉳ ㉴ ㉵ ㉶ ㉷ ㉸ ㉹ ㉺ ㉻ ㈀ ㈁ ㈂ ㈃ ㈄ ㈅ ㈆ ㈇ ㈈ ㈉ ㈊ ㈋ ㈌ ㈍ ㈎ ㈏ ㈐ ㈑ ㈒ ㈓ ㈔ ㈕ ㈖ ㈗ ㈘ ㈙ ㈚ ㈛ ⓐ ⓑ ⓒ ⓓ ⓔ ⓕ ⓖ ⓗ ⓘ ⓙ ⓚ ⓛ ⓜ ⓝ ⓞ ⓟ ⓠ ⓡ ⓢ ⓣ ⓤ ⓥ ⓦ ⓧ ⓨ ⓩ ⒜ ⒝ ⒞ ⒟ ⒠ ⒡ ⒢ ⒣ ⒤ ⒥ ⒦ ⒧ ⒨ ⒩ ⒪ ⒫ ⒬ ⒭ ⒮ ⒯ ⒰ ⒱ ⒲ ⒳ ⒴ ⒵ ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ⑴ ⑵ ⑶ ⑷ ⑸ ⑹ ⑺ ⑻ ⑼ ⑽ ⑾ ⑿ ⒀ ⒁ ⒂ ＄ ％ ￦ Ｆ ′ ″ ℃ Å ￠ ￡ ￥ ¤ ℉ ‰ € ㎕ ㎖ ㎗ ℓ ㎘ ㏄ ㎣ ㎤ ㎥ ㎦ ㎙ ㎚ ㎛ ㎜ ㎝ ㎞ ㎟ ㎠ ㎡ ㎢ ㏊ ㎍ ㎎ ㎏ ㏏ ㎈ ㎉ ㏈ ㎧ ㎨ ㎰ ㎱ ㎲ ㎳ ㎴ ㎵ ㎶ ㎷ ㎸ ㎹ ㎀ ㎁ ㎂ ㎃ ㎄ ㎺ ㎻ ㎼ ㎽ ㎾ ㎿ ㎐ ㎑ ㎒ ㎓ ㎔ Ω ㏀ ㏁ ㎊ ㎋ ㎌ ㏖ ㏅ ㎭ ㎮ ㎯ ㏛ ㎩ ㎪ ㎫ ㎬ ㏝ ㏐ ㏓ ㏃ ㏉ ㏜ ㏆ ㄱ ㄲ ㄼ ㄽ ㄾ ㄿ ㅀ ㄷ ㄸ ㄹ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅁ ㅂ ㅃ ㅄ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅣ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ ㅥ ㅦ ㅧ ㅨ ㅩ ㅪ ㅫ ㅬ ㅭ ㅮ ㅯ ㅰ ㅱ ㅲ ㅳ ㅴ ㅵ ㅶ ㅷ ㅸ ㅹ ㅺ ㅻ ㅼ ㅽ ㅾ ㅿ ㆀ ㆁ ㆂ ㆄ ㆅ ㆆ ㆇ ㆈ ㆉ ㆊ ㆋ ㆌ ㆍ ½ ⅓ ⅔ ¼ ¾ ⅛ ⅜ ⅝ ⅞ ¹ ² ³ ⁴ ⁿ ₁ ₂ ₃ ₄ Ａ Ｂ Ｃ Ｄ Ｅ Ｆ Ｇ Ｈ Ｉ Ｊ Ｋ Ｌ Ｍ Ｎ Ｏ Ｐ Ｑ Ｒ Ｓ Ｔ Ｕ Ｖ Ｗ Ｘ Ｙ Ｚ ａ ｂ ｃ ｄ ｅ ｆ ｇ ｈ ｉ ｊ ｋ ｌ ｍ ｎ ｏ ｐ ｑ ｒ ｓ ｔ ｕ ｖ ｗ ｘ ｙ ｚ Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω ０ １ ２ ３ ４ ５ ６ ７ ８ ９ ⅰ ⅱ ⅲ ⅳ ⅴ ⅵ ⅶ ⅷ ⅸ ⅹ Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ Ⅶ Ⅷ Ⅸ Ⅹ ꊒ ꊓ ꊔ ꊕ ꊖ ꊗ ꊘ ꊙ ꊚ ꊛ ꊈ ꊉ ꊊ ꊋ ꊌ ꊍ ꊎ ꊏ ꊐ ꊑ ꊦ ꊧ ꊨ ꊩ ꊪ ꊫ ꊬ ꊭ ꊮ ꊯ ꊝ ꊞ ꊟ ꊠ ꊡ ꊢ ꊣ ꊤ ꊥ ꋍ ꋎ ꋏ ꋐ ꋑ ꋒ ꋓ ꋔ ꋕ ꋖ ꋠ ꋡ ꋢ ꋣ ꋤ ꋥ ꋦ ꋧ ꋨ ꋩ ꊰ ꊱ ꊲ ꊳ ꊴ ꊵ ꊶ ꊷ ꊸ ꊹ ꊺ ꊻ ꊼ ꊽ ꊾ ꊿ ꋀ ꋁ ꋂ ꓌ ꓍ ꓎ ꓏ ꓐ ꓑ ꓒ ꓓ ꓔ ꓕ ꒐ ꒑ ꒒ ꒓ ꒔ ꒕ ꒖ ꒗ ꒘ ꒙ ꒮ ꒯ ꒰ ꒱ ꒲ ꒳ ꒵ ꒶ ꒷ ꓂ ꓃ ꓄ ꓇ ꓈ ꓉ ꓊ ꓋ ꓖ ꓗ ꓘ ꓙ ꓚ ꓛ ꓜ ꓝ ꓞ ꓟ ꓪ ꓫ ꓬ ꓭ ꓮ ꓯ ꓰ ꓱ ꓲ ꓳ ꓠ ꓡ ꓢ ꓣ ꓤ ꓥ ꓦ ꓧ ꓨ ꓩ ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ⑴ ⑵ ⑶ ⑷ ⑸ ⑹ ⑺ ⑻ ⑼ ⑽ ⑾ ⑿ ⒀ ⒁ ⒂ ꈂ ꈃ ꈄ ꈅ ꈆ ꈇ ꈈ ꈉ ꈊ ꈋ ꈌ ꈍ ꈎ ꈏ ꈐ ꈑ ꈒ ꈓ ꈔ ꈕ ꉭ ꉮ ꉯ ꉰ ꉱ ꉲ ꉳ ꉴ ꉵ ꉶ ꉷ ꉸ ꉹ ꉺ ꉻ ꉼ ꉽ ꉾ ꉿ ꊀ ꆗ ꆘ ꆙ ꆚ ꆛ ꆜ ꆝ ꆞ ꆟ ꆠ ꆡ ꆢ ꆣ ꆤ ꆥ ꆦ ꆧ ꆨ ꆩ ꆪ ꄽ ꄾ ꄿ ꅀ ꅁ ꅂ ꅃ ꅄ ꅅ ꅆ ꆲ ꆳ ꆴ ꆵ ꆶ ꆷ ꆸ ꆹ ꆺ ꆻ ꆼ ꆽ ꆾ ꆿ ꇀ ꇁ ꇂ ꇃ ꇄ ꇅ ꇆ ꇇ ꇈ ꇉ ꇊ ꇋ ꇌ ꇍ ꇎ ꇏ ꇐ ꇑ ꇒ ꇓ ꇔ ꇕ ꇖ ꇗ ꇘ ꇙ ꇚ ꇛ ꇜ ꇝ ꇞ ꇟ ꇠ ꇡ ꇢ ꇣ ꇤ ꇥ ꈝ ꈞ ꈟ ꈠ ꈡ ꈢ ꈣ ꈤ ꈥ ꈦ ꈧ ꈨ ꈩ ꈪ ꈫ ꈬ ꈭ ꈮ ꈯ ꈰ ꈱ ꈲ ꈳ ꈴ ꈵ ꈶ ꈷ ꈸ ꈹ ꈺ ꈻ ꈼ ꈽ ꈾ ꈿ ꉀ ꉁ ꉂ ꉃ ꉄ ꉅ ꉆ ꉇ ꉈ ꉉ ꉊ ꉋ ꉌ ꉍ ꉎ ꉏ ꉐ ꍽ ꍾ ꍿ ꎀ ꎁ ꎂ ꎃ ꎄ ꎅ ꎆ ꎇ ꎈ ꎉ ꎊ ꎋ ꎌ ꎍ ꎎ ꎏ ꎐ ꎑ ꎒ ꎓ ꎔ ꎕ ꎖ ꅇ ꅈ ꅉ ꅊ ꅋ ꅌ ꅍ ꅎ ꅏ ꅐ ꅑ ꅒ ꅓ ꅔ ꅕ ꅖ ꅗ ꅘ ꅙ ꅚ ꅛ ꅜ ꅝ ꅞ ꅟ ꅠ ꅡ ꅢ ꅣ ꅤ ꅥ ꅦ ꅧ ꅨ ꅩ ꅪ ꅫ ꅬ ꅭ ꅮ ꅯ ꅰ ꅱ ꅲ ꅳ ꅴ ꅵ ꅶ ꅷ ꅸ ꅹ ꅺ ⓐ ⓑ ⓒ ⓓ ⓔ ⓕ ⓖ ⓗ ⓘ ⓙ ⓚ ⓛ ⓜ ⓝ ⓞ ⓟ ⓠ ⓡ ⓢ ⓣ ⓤ ⓥ ⓦ ⓧ ⓨ ⓩ ⒜ ⒝ ⒞ ⒟ ⒠ ⒡ ⒢ ⒣ ⒤ ⒥ ⒦ ⒧ ⒨ ⒩ ⒪ ⒫ ⒬ ⒭ ⒮ ⒯ ⒰ ⒱ ⒲ ⒳ ⒴ ⒵ ａ ｂ ｃ ｄ ｅ ｆ ｇ ｈ ｉ ｊ ｋ ｌ ｍ ｎ ｏ ｐ ｑ ｒ ｓ ｔ ｕ ｖ ｗ ｘ ｙ ｚ ꂛ ꂜ ꂝ ꂞ ꂟ ꂠ ꂡ ꂢ ꂣ ꂤ ꂥ ꂦ ꂧ ꂨ ꆉ ꆊ ꆋ ꆌ ꆍ ꆎ ꆏ ꆐ ꆑ ꆒ ꆓ ꆔ ꆕ ꆖ ꇴ ꇵ ꇶ ꇷ ꇸ ꇹ ꇺ ꇻ ꇼ ꇽ ꇾ ꇿ ꈀ ꈁ ꉟ ꉠ ꉡ ꉢ ꉣ ꉤ ꉥ ꉦ ꉧ ꉨ ꉩ ꉪ ꉫ ꉬ ㉮ ㉯ ㉰ ㉱ ㉲ ㉳ ㉴ ㉵ ㉶ ㉷ ㉸ ㉹ ㉺ ㉻ ㈎ ㈏ ㈐ ㈑ ㈒ ㈓ ㈔ ㈕ ㈖ ㈗ ㈘ ㈙ ㈚ ㈛ ꂩ ꂪ ꂫ ꂬ ꂭ ꂮ ꂯ ꂰ ꂱ ꂲ ꃳ ꃴ ꃵ ꃶ ꃷ ꃸ ꃹ ꃺ ꃻ ꃼ ꇦ ꇧ ꇨ ꇩ ꇪ ꇫ ꇬ ꇭ ꇮ ꇯ ꇰ ꇱ ꇲ ꇳ ꅻ ꅼ ꅽ ꅾ ꅿ ꆀ ꆁ ꆂ ꆃ ꆄ ꆅ ꆆ ꆇ ꆈ ꉑ ꉒ ꉓ ꉔ ꉕ ꉖ ꉗ ꉘ ꉙ ꉚ ꉛ ꉜ ꉝ ꉞ ㈀ ㈁ ㈂ ㈃ ㈄ ㈅ ㈆ ㈇ ㈈ ㈉ ㈊ ㈋ ㈌ ㈍ ㉠ ㉡ ㉢ ㉣ ㉤ ㉥ ㉦ ㉧ ㉨ ㉩ ㉪ ㉫ ㉬ ㉭ ꂳ ꂴ ꂵ ꂶ ꂷ ꂸ ꂹ ꂺ ꂻ ꂼ ꂽ ꂾ ꂿ ꃀ ꃁ ꃂ ꃃ ꃄ ꃅ ꃆ ꃇ ꃈ ꃉ ꃊ ꃋ ꃌ ꃍ ꃎ ꃏ ꃐ ꃑ ꃒ ꃓ ꃔ ꃕ ꃖ ꃗ ꃘ ꃙ ꃚ ꃛ ꃜ ꃝ ꃞ ꃟ ꃠ ꃡ ꃢ ꃣ ꃤ ꃥ ꃦ ꃧ ꃨ ꃩ ꃪ ꃫ ꃬ ꃭ ꃮ ꃯ ꃰ ꃱ ꃲ ꃽ ꃾ ꃿ ꄀ ꄁ ꄂ ꄃ ꄄ ꄅ ꄆ ꄇ ꄈ ꄉ ꄊ ꄋ ꄌ ꄍ ꄎ ꄏ ꄐ ꄑ ꄒ ꄓ ꄔ ꄕ ꄖ ꄗ ꄘ ꄙ ꄚ ꄛ ꄜ ꄝ ꄞ ꄟ ꄠ ꄡ ꄢ ꄣ ꄤ ꄥ ꄦ ꄧ ꄨ ꄩ ꄪ ꄫ ꄬ ꄭ ꄮ ꄯ ꄰ ꄱ ꄲ ꄳ ꄴ ꄵ ꄶ ꄷ ꄸ ꄹ ꄺ ꄻ ꄼ ꍟ ꍠ ꍡ ꍢ ꍣ ꍤ ꍥ ꍦ ꍧ ꍨ ꍩ ꍪ ꍯ ꍺ ꍻ ꍼ ꎗ ꎘ ꎙ ꎚ ꎛ ꎜ ꎝ ꎧ ꎨ ꏁ ꏂ ꎯ ꍫ ꍬ ꍭ ꍮ ꎞ ꎟ ꎠ ꎡ ꎪ ꍰ ꍱ ꍲ ꍳ ꍴ ꍵ ꍶ ꍷ ꍸ ꍹ ꎼ ꎽ ꎾ ꎿ ꎮ ꎰ ꎲ ꎬ ꎢ ꎣ ꎤ ꎥ ꎦ ꎩ ꎫ ꎭ ꎱ ꎳ ꎶ ꎷ ꎸ ꎹ ꎺ ꎻ ꏀ ꏃ ꏄ ㋐ ㋑ ㋒ ㋓ ㋔ ㋕ ㋖ ㋗ ㋘ ㋙ ㋚ ㋛ ㋜ ㋝ ㋞ ㋟ ㋠ ㋡ ㋢ ㋣ ㋤ ㋥ ㋦ ㋧ ㋨ ㋩ ㋪ ㋫ ㋬ ㋭ ㋮ ㋯ ㋰ ㋱ ㋲ ㋳ ㋴ ㋵ ㋶ ㋷ ㋸ ㋹ ㋺ ㋻ ㋼ ㋽ ㋾ ㌀ ㌁ ㌂ ㌃ ㌄ ㌅ ㌆ ㌇ ㌈ ㌉ ㌊ ㌋ ㌌ ㌍ ㌎ ㌏ ㌐ ㌑ ㌒ ㌓ ㌔ ㌕ ㌖ ㌗ ㌘ ㌙ ㌚ ㌛ ㌜ ㌝ ㌞ ㌟ ㌠ ㌡ ㌢ ㌣ ㌤ ㌥ ㌦ ㌧ ㌨ ㌩ ㌪ ㌫ ㌬ ㌭ ㌮ ㌯ ㌰ ㌱ ㌲ ㌳ ㌴ ㌵ ㌶ ㌷ ㌸ ㌹ ㌺ ㌻ ㌼ ㌽ ㌾ ㌿ ㍀ ㍁ ㍂ ㍃ ㍄ ㍅ ㍆ ㍇ ㍈ ㍉ ㍊ ㍋ ㍌ ㍍ ㍎ ㍏ ㍐ ㍑ ㍒ ㍓ ㍔ ㍕ ㍖ ㍗ ᐰ ᐱ ᐲ ᐳ ᐴ ᐵ ᐶ ᐷ ᐸ ᐹ ᐺ ᐻ ᐼ ᐽ ᐾ ᐿ ᑀ ᑁ ᑂ ᑃ ᑄ ᑅ ᑆ ᑇ ᑈ ᑉ ᑊ ᑋ ᑌ ᑍ ᑎ ᑏ ᑐ ᑑ ᑒ ᑓ ᑔ ᑕ ᑖ ᑗ ᑘ ᑙ ᑚ ᑛ ᑜ ᑝ ᑞ ᑟ ᑠ ᑡ ᑢ ᑣ ᑤ ᑥ ᑦ ᑧ ᑨ ᑩ ᑪ ᑫ ᑬ ᑭ ᑮ ᑯ ᑰ ᑱ ᑲ ᑳ ᑴ ᑵ ᑶ ᑷ ᑸ ᑹ ᑺ ᑻ ᑼ ᑽ ᑾ ᑿ ᒀ ᒁ ᒂ ᒃ ᒄ ᒅ ᒆ ᒇ ᒈ ᒉ ᒊ ᒋ ᒌ ᒍ ᒎ ᒏ ᒐ ᒑ ᒒ ᒓ ᒔ ᒕ ᒖ ᒗ ᒘ ᒙ ᒚ ᒛ ᒜ ᒝ ᒞ ᒟ ᒠ ᒡ ᒢ ᒣ ᒤ ᒥ ᒦ ᒧ ᒨ ᒩ ᒪ ᒫ ᒬ ᒭ ᒮ ᒯ ᓐ ᓑ ᓒ ᓓ ᓔ ᓕ ᓖ ᓗ ᓘ ᓙ ᓚ ᓛ ᓜ ᓝ ᓞ ᓟ ᓠ ᓡ ᓢ ᓣ ᓤ ᓥ ᓦ ᓧ ᓨ ᓩ ᓪ ᓫ ᓬ ᓭ ᓮ ᓯ ᓰ ᓱ ᓲ ᓳ ᓴ ᓵ ᓶ ᓷ ᓸ ᓹ ᓺ ᓻ ᓼ ᓽ ᓾ ᓿ ᔐ ᔑ ᔒ ᔓ ᔔ ᔕ ᔖ ᔗ ᔘ ᔙ ᔚ ᔛ ᔜ ᔝ ᔞ ᔟ ᔠ ᔡ ᔢ ᔣ ᔤ ᔥ ᔦ ᔧ ᔨ ᔩ ᔪ ᔫ ᔬ ᔭ ᔮ ᔯ ᔰ ᔱ ᔲ ᔳ ᔴ ᔵ ᔶ ᔷ ᔸ ᔹ ᔺ ᔻ ᔼ ᔽ ᔾ ᔿ ᕀ ᕁ ᕂ ᕃ ᕄ ᕅ ᕆ ᕇ ᕈ ᕉ ᕊ ᕋ ᕌ ᕍ ᕎ ᕏ ᕐ ᕑ ᕒ ᕓ ᕔ ᕕ ᕖ ᕗ ᕘ ᕙ ᕚ ᕛ ᕜ ᕝ ᕞ ᕟ ᕠ ᕡ ᕢ ᕣ ᕤ ᕥ ᕦ ᕧ ᕨ ᕩ ᕪ ᕫ ᕬ ᕭ ᕮ ᕯ ᕰ ᕱ ᕲ ᕳ ᕴ ᕵ ᕶ ᕷ ᕸ ᕹ ᕺ ᕻ ᕼ ᕽ ᕾ ᕿ ᖠ ᖡ ᖢ ᖣ ᖤ ᖥ ᖦ ᖧ ᖨ ᖩ ᖪ ᖫ ᖬ ᖭ ᖮ ᖯ ᖰ ᖱ ᖲ ᖳ ᖴ ᖵ ᖶ ᖷ ᖸ ᖹ ᖺ ᖻ ᖼ ᖽ ᖾ ᖿ ᗀ ᗁ ᗂ ᗃ ᗄ ᗅ ᗆ ᗇ ᗈ ᗉ ᗊ ᗋ ᗌ ᗍ ᗎ ᗏ ᗐ ᗑ ᗒ ᗓ ᗔ ᗕ ᗖ ᗗ ᗘ ᗙ ᗚ ᗛ ᗜ ᗝ ᗞ ᗟ ᗠ ᗡ ᗢ ᗣ ᗤ ᗥ ᗦ ᗧ ᗨ ᗩ ᗪ ᗫ ᗬ ᗭ ᗮ ᗯ ᗰ ᗱ ᗲ ᗳ ᗴ ᗵ ᗶ ᗷ ᗸ ᗹ ᗺ ᗻ ᗼ ᗽ ᗾ ᗿ ᘀ ᘂ ᘃ ᘄ ᘅ ᘆ ᘇ ᘈ ᘉ ᘊ ᘋ ᘌ ᘍ ᘎ ᘏ ᘐ ᘑ ᘒ ᘓ ᘔ ᘕ ᘖ ᘗ ᘘ ᘙ ᘚ ᘛ ᘜ ᘝ ᘞ ᘟ ᘠ ᘡ ᘢ ᘣ ᘤ ᘥ ᘦ ᘧ ᘨ ᘩ ᘪ ᘫ ᘬ ᘭ ᘮ ᘯ ᘰ ᘱ ᘲ ᘳ ᘴ ᘵ ᘶ ᘷ ᘸ ᘹ ᘺ ᘻ ᘼ ᘽ ᘾ ᘿ ᙀ ᙁ ᙂ ᙃ ᙄ ᙅ ᙆ ᙇ ᙈ ᙉ ᙊ ᙋ ᙌ ᙍ ᙎ ᙏ ᙐ ᙑ ᙒ ᙓ ᙔ ᙕ ᙖ ᙗ ᙘ ᙙ ᙚ ᙛ ᙜ ᙝ ᙞ ᙟ ᙠ ᙡ ᙢ ᙣ ᙤ ᙥ ᙦ ᙧ ᙨ ᙩ ᙪ ᙫ ᙬ ᙯ ᙰ ᙱ ᙲ ᙳ ᙴ ᙵ ᙶ ઁ ં ઃ અ આ ઇ ઈ ઉ ઊ ઋ ઍ એ ઐ ઑ ઓ ઔ ક ખ ગ ઘ ઙ ચ છ જ ઝ ઞ ટ ઠ ડ ઢ इ उ ऊ ऋ ऌ क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त द न ऩ प फ ब भ म य र ऱ ल ळ ऴ व श ष स ह क़ ख़ ग़ ज़ ड़ ढ़ फ़ य़ ॠ ॡ Ա Բ Գ Դ Ե Զ Է Ը Թ Ժ Ի Լ Խ Ծ Կ Հ Ձ Ղ Ճ Մ Յ Ն Շ Ո Չ Պ Ջ Ռ Ս Վ Տ Ր ա բ գ դ ե զ է ը թ ժ ի լ խ ծ կ հ ձ ղ ճ մ յ ն ո չ պ ջ ռ ս վ տ ր ց ւ փ ք օ ֆ և ឃ ង ច ឆ ឈ ញ ដ ឋ ឌ ឍ ណ ត ថ ទ ធ ន ប ផ ភ ម យ ល ឝ ឞ ស ឡ អ ឤ ឥ ឦ ឨ ឩ ឬ ឭ ឯ ឰ ឱ ឲ ឳ ឴ ឵ ា ១ ២ ៣ ៥ ៦ ៧ ៨ ៩ ஆ இ ஈ ஊ எ ஏ ஐ ஒ ஓ ஔ ஂ ஃ ா ி ௗ ங ஜ ஞ ண ந ன ம ய ற ல ள ழ வ ஸ ஹ ௧ ௨ ௩ ௪ ௫ а б в г д е ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я ё ђ ѓ є ѕ і ї ј љ њ ћ ќ ў џ ޥ ਕ ਗ ਘ ਙ ਚ ਛ ਜ ਝ ਞ ਟ ਡ ਢ ਣ ਤ ਥ ਦ ਧ ਨ ਪ ਫ ਬ ਭ ਯ ਰ ਲ ਲ਼ ਵ ਸ ਹ ਖ਼ ਗ਼ ਜ਼ ੜ ਫ਼ ଆ ଇ ଈ ଉ ଊ ଋ ଌ ଐ ଓ ଔ ଖ ଗ ଘ ଙ ଛ ଜ ଝ ଞ ଟ ଢ ଣ ତ ଥ ଧ ନ ପ ଫ ବ ଭ ମ ଯ ର ଳ ଶ ଷ ସ ହ ం ః అ ఆ ఇ ఈ ఉ ఊ ఋ ఌ ఎ ఏ ఐ ఒ ఓ ఔ క ఖ గ ఘ ఙ చ ఛ జ ఝ ఞ ట ఠ డ ఢ ణ త థ ద ధ న ప ఫ బ భ మ య ర ఱ ల ళ వ శ ష హ ా ి ౕ ౖ ౠ ౡ ౨ ౩ ౪ ౫ ౬ ౭ ౮ ౯ ಂ ಃ ಅ ಆ ಇ ಈ ಉ ಊ ಋ ಌ ಎ ಏ ಐ ಒ ಓ ಔ ಕ ಖ ಗ ಘ ಙ ಚ ಛ ಜ ಝ ಞ ಟ ಠ ಡ ಢ ಣ ತ ಥ ದ ಧ ನ ಪ ಫ ಬ ಭ ಮ ರ ಱ ಲ ಳ ವ ಶ ಷ ૦ ૧ ૨ ૩ ૪ ૫ ૬ ૭ ૮ ૯ ੦ ੧ ੨ ੩ ੪ ੫ ੬ ੭ ੮ ੯ ║ ╒ ╓ ╔ ╕ ╖ ╗ ╘ ╙ ╚ ╛ ╜ ╝ ╞ ╟ ╠ ╡ ╢ ╣ ╤ ╥ ╦ ╧ ╨ ╩ ╪ ╫ ╬ ꋰ ꋱ ꋲ ꋳ ꋴ ꋵ ꋶ ꋷ ꋸ ꋹ ꋺ ꋻ ꋼ ꋽ ꀢ ꀣ ꀤ ꀥ ꀦ ꀧ ꀨ ꀩ ꀪ ꀫ ꀬ ꀭ ꀲ ꀳ ⇒ ⇔ ꀮ ꀯ ꀰ ꀱ ← ↑ → ↓ ↔ ↕ ↖ ↗ ↘ ↙ ꀹ ꀺ ꀻ ꀼ ꀽ ꁼ ꁽ ꁾ ꁿ ꀴ ꀵ ꀶ ꀷ ꀸ ꀾ ꀿ ꁂ ꁃ ꁄ ꁅ ꎴ ꎵ ꍖ ꍗ ꍘ ꍙ ꍚ ꍛ ꍜ ꍝ ܁ ܂ ܃ ܄ ܅ ܆ ܇ ܈ ܉ ꌈ ꌉ ꌊ ꌋ ꌌ ꌍ ꌎ ꌏ ꌐ ꌀ ꌁ ꀞ ꀟ ꀆ ꀇ ꀈ ꀉ ꀊ ꀋ ꀌ ꀍ ꀎ ꀏ ꀐ ꀑ ꀒ ꀓ ꀔ ꀕ ꀖ ꀗ ꀘ ꀙ ꀚ ꀛ ꀜ ꀝ ༼ ༽ ༾ ༿ ⌠ ⌡ꌼ ꌽ ꌾ ꌿ ꍀ ꍁ ꍂ ꍃ ꍄ ꍅ ꍆ ꍇ ꍈ ꍉ ꍐ ꍑ ꍊ ꍋ ꍌ ꍍ ꍎ ꍏ ꍒ ꍓ ꍔ ꍕ ᚛ ᚜ ꌑ ꌒ ꌓ ꌔ ꌕ ꌖ ꌗ ꌘ ꌙ ꌚ ꌛ ꌜ ꌝ ꌞ ꌟ ꌠ ꌡ ꌢ ꌣ ꌤ ꌥ ꌦ ꌧ ꌨ ꌩ ꌪ ꌫ ꌬ ꌭ ꌮ ꌯ ꌰ ꌱ ꌲ ꌳ ꌴ ꌵ ꌶ ꌷ ꏪ ꏫ ꏬ ▒ ▓ ░ ꁳ ꁴ ꁵ ꁶ ꁷ ꁸ ꁣ ꁤ ꁥ ꁦ ꁧ ꁨ ꁩ ꁪ ꁫ ꁬ ꁭ ꁮ ꁯ ꁰ ꁱ ꁲ ◆ ◇ ◈ ꂔ ꂕ ꂗ ꂘ ꂙ ▣ ▤ ▥ ▦ ▧ ▨ ▩ ᚠ ᚡ ᚢ ᚣ ᚤ ᚥ ᚦ ᚧ ᚨ ᚩ ᚪ ᚫ ᚬ ᚭ ᚮ ᚯ ᚰ ᚱ ᚲ ᚳ ᚴ ᚵ ᚶ ᚷ ᚸ ᚹ ᚺ ᚻ ᚼ ᚽ ᚾ ᚿ ᛀ ᛁ ᛂ ᛃ ᛄ ᛅ ᛆ ᛇ ᛈ ᛉ ᛊ ᛋ ᛌ ᛍ ᛎ ᛏ ᛐ ᛑ ᛒ ᛓ ᛔ ᛕ ᛖ ᛗ ᛘ µ ¶ ܏ᛙ ᛚ ᛛ ᛜ ᛝ ᛞ ᛟ ᛠ ᛡ ᛢ ᛣ ᛤ ᛥ ᛦ ᛧ ᛨ ᛩ ᛪ ᛫ ᛬ ᛭ ᛮ ᛯ ᛰ   ᚁ ᚂ ᚃ ᚄ ᚅ ᚆ ᚇ ᚈ ᚉ ᚊ ᚋ ᚌ ᚍ ᚎ ᚏ ᚐ ᚑ ᚒ ᚓ ᚔ ꁌ ꁍ ꁎ ꁏ ꁐ ♩ ♪ ♫ ♬ ♭  ꁔ ꁕ ꁖ ꁗ ꁛ ꁜ ꁝ ꁞ ꁟ ꁠ ꁡ ꁑ ꁒ ꁓ ꁘ ꁙ ꁚ ꁢ ꁇ ܀ ܊ ܋ ܌ ܍ ¤ ፨ ₪ ꂇ ◘ ◙ ⌂ ☺ ☻ ♀ ♂ ꋭ ꋯ ᚗ ᚘ ፡ ። ፣ ፤ ፥ ፦ ፧ ‘ ’ ‚ ‛ “ ” „ ‥ … ‧ ′ ″ 〝 〞 〟 ꏯ ꏰ ꏱ ꏲ ꏳ ꏴ ꏣ ꏤ ꏥ ꏦ ꏧ ꏨ ꏩ ꏛ ꏜ ꏝ ꏞ ꏟ ꏠ ꏡ ꏢ ꏍ ꏎ ꏏ ꏐ ꏑ ꏒ ꏇ ꏈ ꏔ ꏕ ꏖ ꏮ ꂚ ꏅ ꏚ ꏋ ☼ ꀀ ꁋ ꂊ ꂐ ꏗ ꏘ ꏙ ꁉ ꏆ ꁹ ꁺ ꁻ ꂂ ꂃ ꂅ ꂆ ꂈ ꂉ ꏊ ꏓ ꂋ ꂌ ꂍ ꂎ ꂏ ꂑ ꂒ ꂓ ꂖ 〒',
    title: '@ 고객님의 지원문의사항 요청입니다.',
    html: `<center>
            <table align="center" style="border-collapse: collapse;" border="1">
              <tr>
                <th style="padding: 10px;">추천</th>
                <td style="padding: 10px;">
                  @대한민국 최대  더킹,코인 ~ ㉪ㅏ~ ㉨ㅣ~ 노<br>
                  안@전 빠^른 일*대일 전용 (계)=좌 입+{출}<br>
                  신@뢰 보~안 시—스템 1·위  100%검@증/된 사이트만 추천합니다. 
                </td>
              </tr>
              <tr>
                <th style="padding: 10px;">추천</th>
                <td style="padding: 10px;">abcmm999%com</a></td>
              </tr>
            </table>
          </center>`,
    statis: { send: 0, failure: 0, percent: 0 },
    head: [
      { text: '보낸수', align: 'center', sortable: false, value: 'send' },
      { text: '실패수', align: 'center', sortable: false, value: 'failure' },
      { text: '페센트', align: 'center', sortable: false, value: 'percent' }
    ],
    headers: [
      { text: '개수', align: 'center', sortable: false, value: 'index', width: 80 },
      { text: '보낸아이디', align: 'center', sortable: false, value: 'id' },
      { text: '받은아이디', align: 'center', sortable: false, value: 'sid' },
      { text: '타이틀', align: 'center', sortable: false, value: 'title' },
      { text: '애러코드', align: 'center', sortable: false, value: 'err', width: 80 },
      { text: '성공여부', align: 'center', sortable: false, value: 'is', width: 80 }
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
            this.ids = text.split(/[\r\n]+/)
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
      const chun = this.ids.length / 50
      const cArr = _.chunk(this.ids, 50)
      for (let i = 0; i < chun; i++) {
        for (const a in cArr[i]) {
          for (const b in this.idpw) {
            if (!this.play) return
            const v = this.idpw[b]
            let html = `<center>
              <table align="center" style="border-collapse: collapse;" border="1">
                <tr>
                  <th style="padding: 10px;">추천</th>
                  <td style="padding: 10px;">
                    @대한민국 최대  더킹,코인 ~ ㉪ㅏ~ ㉨ㅣ~ 노<br>
                    안@전 빠^른 일*대일 전용 (계)=좌 입+{출}<br>
                    신@뢰 보~안 시—스템 1·위  100%검@증/된 사이트만 추천합니다. 
                  </td>
                </tr>
                <tr>
                  <th style="padding: 10px;">추천</th>
                  <td style="padding: 10px;">abcmm999%com</a></td>
                </tr>
              </table>
            </center>`
            const htmlLen = html.split('@').length
            for (let index = 1; index < htmlLen; index++) {
              const ran = Math.floor((Math.random() * this.sText.split(' ').length))
              const sTxt = this.sText.split(' ')[ran]
              html = html.replace('@', sTxt)
            }
            const dian = Math.floor((Math.random() * this.dian.length))
            const ranIdpw = Math.floor((Math.random() * this.idpw.length))
            html = html.replace('%com', `${this.dian[dian]}com`)
            let params = {}
            if (a % 100 === 0) {
              params = {
                id: v.id,
                pw: v.pw,
                to: 'jinaishan0517',
                html: html,
                title: this.title.replace('@', 'jinaishan0517')
              }
            } else {
              params = {
                id: v.id,
                pw: v.pw,
                to: this.ids[ranIdpw],
                html: html,
                title: this.title.replace('@', this.ids[a])
              }
            }
            if (await this.ajaxEmail(params)) break
          }
        }
      }
    },
    ajaxEmail(params) {
      return new Promise(async(resolve, reject) => {
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
          _.remove(this.ids, (obj) => {
            return obj === this.ids[a]
          })
          resolve(true)
        } else {
          this.statis.failure += 1
          if (info.data.responseCode === 535 || info.data.responseCode === 452) {
            _.remove(this.idpw, (obj) => {
              return obj.id === v.id
            })
          }
          this.datas.unshift({
            to: `${params.id}@daum.net`,
            from: `${params.to}@naver.com`,
            err: `${info.data.responseCode}`,
            title: params.title,
            is: false
          })
        }
      })
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
