import { FC } from 'react'

type Props = {
  amount?: string
}

const DataMoneyCell: FC<Props> = ({ amount }) => {
  const formatMoney = (value: string | undefined): string => {
    if (!value) return 'N/A'
    return parseFloat(value)
      .toFixed(0) 
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return <div>{formatMoney(amount)}</div>
}

export { DataMoneyCell }
