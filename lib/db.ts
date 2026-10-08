// lib/db.ts
import {
  HERO_DATA,
  SOCIAL_LINKS_DATA,
  OPEN_SOURCE_DATA,
  PROJECTS_DATA,
  GEARS_DATA,
  SKILLS_DATA,
  EDUCATIONS_DATA,
  HeroData,
  SocialLinkItem,
  OpenSourceData,
  ProjectItem,
  GearItem,
  SkillItem,
  EducationItem,
} from './data'

export interface StoredTrack {
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
  playedAt?: string
}

let cachedLastPlayed: StoredTrack = {
  title: 'Shinzou wo Sasageyo!',
  artist: 'Linked Horizon',
  album: 'Attack on Titan OST',
  albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b27394c54b0918e86cb477b594f4',
  songUrl: 'https://open.spotify.com',
  playedAt: new Date().toISOString(),
}

export async function saveLastPlayedTrack(track: StoredTrack) {
  if (track.title && track.title !== 'Not Playing') {
    cachedLastPlayed = { ...track, playedAt: new Date().toISOString() }
  }
}

export async function getLastPlayedTrack(): Promise<StoredTrack> {
  return cachedLastPlayed
}

export async function getPortfolioHero(): Promise<HeroData> {
  return HERO_DATA
}

export async function getPortfolioSocialLinks(): Promise<SocialLinkItem[]> {
  return SOCIAL_LINKS_DATA
}

export async function getPortfolioOpenSource(): Promise<OpenSourceData> {
  return OPEN_SOURCE_DATA
}

export async function getPortfolioProjects(): Promise<ProjectItem[]> {
  return PROJECTS_DATA
}

export async function getPortfolioGears(): Promise<GearItem[]> {
  return GEARS_DATA
}

export async function getPortfolioSkills(): Promise<SkillItem[]> {
  return SKILLS_DATA
}

export async function getPortfolioEducations(): Promise<EducationItem[]> {
  return EDUCATIONS_DATA
}