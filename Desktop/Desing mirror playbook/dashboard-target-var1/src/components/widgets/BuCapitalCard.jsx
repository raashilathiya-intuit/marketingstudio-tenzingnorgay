import React from 'react'
import BuCard from './BuCard'
import { WIDGET_DATA } from '../../data/mock'

export default function BuCapitalCard({ inFavourite }) {
  return <BuCard data={WIDGET_DATA['bu-capital']} sparklineColor="var(--chart-green)" inFavourite={inFavourite} />
}
