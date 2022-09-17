<script lang="ts">
import type { Currency, Data } from '@/Type/Type'
import axios from 'axios'


export const Rub: Currency = {
    ID: '001',
    CharCode: 'RUB',
    Name: 'Рубль',
    Previous: 1,
    Value: 1
  }

export default {
  name: 'Currencies',
  data(): Data {
    return {
      currencies: [],
      selected: Rub,
      amount: null,
      currencies_value: 1,
      update_date: null,
      errors: [],
      search: ''
    }
  },
  computed: {
    currenciesList(): Currency[] {
      return [Rub, ...this.currencies]
        .filter(c => c.ID )
        .map(c => ({
          ...c,
          Value: (c.Value / this.selected.Value).toFixed(2),
          Previous: (c.Previous / this.selected.Previous).toFixed(2),
          Sum: (this.currencies_value * (c.Value / this.selected.Value)).toFixed(2)
        }))  
    },
    filteredCurrency(){
      return this.currenciesList.filter(currencies => currencies.CharCode.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  methods: {
    onSelectCurrency(ID: string): void {
      this.selected = [Rub, ...this.currencies].find(c => c.ID == ID)
    },
    fetchData() {
      axios.get('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(response => {
          const valute = response.data.Valute
          this.currencies = Object.entries(valute).map(([k, v]) => v)
          this.update_date = response.data.Timestamp
          console.log(response)
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  },
  mounted() {
    this.fetchData();
  }
}

</script>

<template>
  <div class="container">
    <div class="container_top">
      <div>
        <div>
          <h4>Дата обновления: {{update_date}}</h4>
        </div>
        <h2>
          У меня есть:
        </h2>
        <div class="container__one">
          <input 
          class="type-1" 
          type="number" 
          name="input-one" 
          placeholder=1
          id="input-one" 
          v-model.number="currencies_value"
          @change="fetchData()" />
          {{selected.CharCode}}
        </div>
      </div>
      <div class="container__two">
        <input 
        class="type-2" 
        type="text" 
        placeholder="Найти..."
        v-model="search"/>
        <div class="description">
          <p>
            Сейчас основная валюта - RUB
          </p>
          <p>
            Мы хотим что бы основной стала EUR
          </p>
          <p>
            Просто кликните по карточке EUR RUB
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="currencies-shell">
    <div class="currency-item" 
      v-for="cur in filteredCurrency" 
      v-bind:key="cur.ID"
      v-bind:class="{ active: isActive}"
      @click="onSelectCurrency(cur.ID)">
      <div class="currencies__char-code" v-if="cur.CharCode == this.selected.CharCode">
        {{cur.CharCode}}
      </div>
      <div class="currencies__char-code" v-else>
        {{cur.CharCode}} {{this.selected.CharCode}}
      </div>
      <div class="currency__name">
        {{cur.Name}}
      </div>
      <div class="currency__container">
        <span class="currency__sum"><i class="i_sum">∑</i>{{cur.Sum}}</span>
        <span v-if="cur.Previous < cur.Value" class="currency__value"><i class="arrow_top">⇧</i>{{cur.Value}}</span>
        <span v-else-if="cur.Previous == cur.Value" class="currency__value"><i class="arrow_top"></i>{{cur.Value}}</span>
        <span v-else class="currency__value__down"><i class="arrow_down">⇩</i>{{cur.Value}}</span>
      </div>
    </div>
  </div>
</template>
