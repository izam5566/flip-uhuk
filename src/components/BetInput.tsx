import { LAMPORTS_PER_SOL, useGamba } from 'gamba'
import React, { useState } from 'react'
import styled from 'styled-components'
import { SmallButton, Input } from '../styles'
import { MIN_WAGER } from '../constants'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
`

const Controls = styled.div`
  position: absolute;
  right: 10px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
`

interface Props {
  wager: number
  onChange: (wager: number) => void
}

export function BetInput({ wager, onChange }: Props) {
  const gamba = useGamba()
  const maxWager = gamba.house.maxPayout / LAMPORTS_PER_SOL / 2
  const [_wager, _setWager] = useState(String(wager))
  const accountCreated = gamba.user.created

  const setWager = (x: number) => {
    const max = Math.min(maxWager, Math.max(gamba.wallet.balance, gamba.user.balance))
    const wager = Math.max(MIN_WAGER, Math.min(max, x))
    _setWager(String(wager))
    onChange(wager)
  }

  return (
    <Wrapper>
      <Input
        placeholder="Wager (SOL)"
        value={_wager}
        disabled={!gamba.connected}
        onChange={(e) => _setWager(e.target.value)}
        onBlur={() => setWager(Number(_wager))}
      />
      <Controls>
        <SmallButton disabled={!accountCreated} onClick={() => setWager(MIN_WAGER)}>
          MIN
        </SmallButton>
        <SmallButton disabled={!accountCreated} onClick={() => setWager(maxWager)}>
          MAX
        </SmallButton>
        <SmallButton disabled={!accountCreated} onClick={() => setWager(wager / 2)}>
          X.5
        </SmallButton>
        <SmallButton disabled={!accountCreated} onClick={() => setWager(wager * 2)}>
          X2
        </SmallButton>
      </Controls>
    </Wrapper>
  )
}
