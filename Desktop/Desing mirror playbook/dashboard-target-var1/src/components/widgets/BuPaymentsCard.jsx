import React from 'react'
import BuCard from './BuCard'
import { WIDGET_DATA } from '../../data/mock'

export default function BuPaymentsCard({ inFavourite }) {
  return <BuCard data={WIDGET_DATA['bu-payments']} sparklineColor="var(--chart-green)" inFavourite={inFavourite} />
}
