import { useCallback, useMemo, useRef, useState } from 'react'
import { HomeActivityContext } from './home-context'
import { SHIP_DATE_OPTIONS, getFollowingShipDate } from '../data/shippingDates'

const FLAVORS = ['Peach Glow', 'Berry Radiance', 'Citrus Boost', 'Tropical Shine']

const CHALLENGE_PTS = 120

export function HomeActivityProvider({ children }) {
  const [deliveryScheduled, setDeliveryScheduled] = useState(true)
  const [deliveryDate, setDeliveryDate] = useState('Thu, May 15')
  const [deliveryFlavor, setDeliveryFlavor] = useState('Berry Radiance')
  const [deliveryPack, setDeliveryPack] = useState('chilled 12-pack')

  const [challengeComplete, setChallengeComplete] = useState(false)
  const [glowPointsBalance, setGlowPointsBalance] = useState(1840)
  const challengeCompleteRef = useRef(false)

  const completeChallenge = useCallback(() => {
    if (challengeCompleteRef.current) return
    challengeCompleteRef.current = true
    setChallengeComplete(true)
    setGlowPointsBalance((b) => b + CHALLENGE_PTS)
  }, [])

  const applyDeliveryEdit = useCallback(({ date, flavor, pack }) => {
    if (date) setDeliveryDate(date)
    if (flavor) {
      setDeliveryFlavor(flavor)
      if (!pack) setDeliveryPack('chilled 12-pack')
    }
    if (pack) setDeliveryPack(pack)
    setDeliveryScheduled(true)
  }, [])

  const cancelDelivery = useCallback(() => {
    setDeliveryScheduled(false)
  }, [])

  const resumeDelivery = useCallback(() => {
    setDeliveryScheduled(true)
  }, [])

  /** Pushes the next ship date one slot later and keeps schedule active (same as “skip this window”). */
  const shiftDeliveryLater = useCallback(() => {
    setDeliveryDate((prev) => getFollowingShipDate(prev))
    setDeliveryScheduled(true)
  }, [])

  const deductGlowPoints = useCallback((points) => {
    const n = Math.max(0, Math.floor(Number(points)))
    if (!n) return
    setGlowPointsBalance((b) => Math.max(0, b - n))
  }, [])

  const value = useMemo(
    () => ({
      deliveryScheduled,
      deliveryDate,
      deliveryFlavor,
      deliveryPack,
      FLAVORS,
      DATE_OPTIONS: SHIP_DATE_OPTIONS,
      applyDeliveryEdit,
      cancelDelivery,
      resumeDelivery,
      shiftDeliveryLater,
      challengeComplete,
      challengePoints: CHALLENGE_PTS,
      glowPointsBalance,
      completeChallenge,
      deductGlowPoints,
      pointsPerFiveDollars: 500,
      dollarsPerRedemption: 5,
    }),
    [
      deliveryScheduled,
      deliveryDate,
      deliveryFlavor,
      deliveryPack,
      applyDeliveryEdit,
      cancelDelivery,
      resumeDelivery,
      shiftDeliveryLater,
      challengeComplete,
      glowPointsBalance,
      completeChallenge,
      deductGlowPoints,
    ],
  )

  return <HomeActivityContext.Provider value={value}>{children}</HomeActivityContext.Provider>
}
