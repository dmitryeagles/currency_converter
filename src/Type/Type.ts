export type Currency = {
    CharCode: string
    Name: string
    ID: string
    Previous: number
    Value: number
  }
  
export type Data = {
    currencies: Currency[]
    selected: Currency
    amount: number | null
    errors: any[]
    update_date: number | null
    currencies_value: number | null
    search: string
  }
  