import mainCover from '../assets/covers/main-cover.png'
import mainCoverWebp from '../assets/covers/main-cover.webp'
import starsAndGuides from '../assets/covers/stars-and-guides.png'
import starsAndGuidesWebp from '../assets/covers/stars-and-guides.webp'
import weightOfTime from '../assets/covers/weight-of-time.png'
import weightOfTimeWebp from '../assets/covers/weight-of-time.webp'
import cracksInTheNight from '../assets/covers/cracks-in-the-night.png'
import cracksInTheNightWebp from '../assets/covers/cracks-in-the-night.webp'
import echoAndLight from '../assets/covers/echo-and-light.png'
import echoAndLightWebp from '../assets/covers/echo-and-light.webp'

export type SectionCoverAsset = {
  id: string
  ariaLabel: string
  image: string
  webpImage: string
}

export const mainSectionCover: SectionCoverAsset = {
  id: 'main-cover',
  ariaLabel: '照亮他人的人，谁来照亮他们？',
  image: mainCover,
  webpImage: mainCoverWebp,
}

export const dataSectionCovers = {
  group: {
    id: 'stars-and-guides',
    ariaLabel: '群星与引路人',
    image: starsAndGuides,
    webpImage: starsAndGuidesWebp,
  },
  time: {
    id: 'weight-of-time',
    ariaLabel: '时间的重量',
    image: weightOfTime,
    webpImage: weightOfTimeWebp,
  },
  dilemma: {
    id: 'cracks-in-the-night',
    ariaLabel: '暗夜里的裂缝',
    image: cracksInTheNight,
    webpImage: cracksInTheNightWebp,
  },
  echo: {
    id: 'echo-and-light',
    ariaLabel: '追光与回响',
    image: echoAndLight,
    webpImage: echoAndLightWebp,
  },
} satisfies Record<string, SectionCoverAsset>
