import {
  getLatestVersions,
  getEvents as dbGetEvents,
  getEvent as dbGetEvent,
  getPhotos,
  getPhotoByVariant,
} from '@repo/database';
import type {
  SectionHeaderData,
  PageHeaderData,
  AdoptionStepData,
  VolunteerRoleData,
  DonationOptionData,
  AboutPageData,
  BeforeYouApplyData,
  PostAdoptionSupportData,
  LostHoundSuggestionData,
  WhyGreyhoundData,
} from '@repo/types';

function getPhotoUrl(s3Key: string): string {
  const bucket = process.env.S3_BUCKET_NAME;
  const region = process.env.S3_REGION ?? 'us-west-2';
  return `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;
}

// ── Events ──

export type WebEvent = {
  id: number;
  title: string;
  date: string;
  startDate: string;
  endDate: string | null;
  recurrence: string;
  time: string;
  location: string;
  type: 'Annual' | 'Fundraiser' | 'Monthly' | 'Weekly' | 'Seasonal' | 'Special';
  description: string;
  longDescription: string;
  showUpcoming: boolean;
  image?: string;
  mobileImage?: string;
};

type DbEvent = Awaited<ReturnType<typeof dbGetEvents>>[number];

async function toWebEvent(event: DbEvent): Promise<WebEvent> {
  const [eventPhotos, mobilePhoto] = await Promise.all([
    getPhotos('event', event.id),
    getPhotoByVariant('event', event.id, 'mobile'),
  ]);
  const photo = eventPhotos[0];
  return {
    id: event.id,
    title: event.title,
    date: event.startDate,
    startDate: event.startDate,
    endDate: event.endDate,
    recurrence: event.recurrence,
    time: event.time,
    location: event.location,
    type: event.type,
    description: event.description,
    longDescription: event.longDescription,
    showUpcoming: event.showUpcoming,
    image: photo ? getPhotoUrl(photo.s3Key) : undefined,
    mobileImage: mobilePhoto ? getPhotoUrl(mobilePhoto.s3Key) : undefined,
  };
}

export async function getEvents(): Promise<WebEvent[]> {
  const events = await dbGetEvents();
  return Promise.all(events.map(toWebEvent));
}

export async function getEvent(id: number): Promise<WebEvent | undefined> {
  const event = await dbGetEvent(id);
  if (!event) return undefined;
  return toWebEvent(event);
}

// ── Versioned content helpers ──

function extractData<T>(results: { item: unknown; version: { data: unknown } }[]): T[] {
  return results.map((r) => r.version.data as T);
}

function extractSingle<T>(results: { item: unknown; version: { data: unknown } }[]): T | undefined {
  return results[0] ? (results[0].version.data as T) : undefined;
}

// ── Content type fetchers ──

// Cache header fetches within a request to avoid duplicate DB queries
// when multiple getSectionHeader/getPageHeader calls run in parallel
let sectionHeadersPromise: Promise<Awaited<ReturnType<typeof getLatestVersions>>> | null = null;
let pageHeadersPromise: Promise<Awaited<ReturnType<typeof getLatestVersions>>> | null = null;

function getAllSectionHeaders() {
  if (!sectionHeadersPromise) {
    sectionHeadersPromise = getLatestVersions('sectionHeader').finally(() => {
      sectionHeadersPromise = null;
    });
  }
  return sectionHeadersPromise;
}

function getAllPageHeaders() {
  if (!pageHeadersPromise) {
    pageHeadersPromise = getLatestVersions('pageHeader').finally(() => {
      pageHeadersPromise = null;
    });
  }
  return pageHeadersPromise;
}

export async function getSectionHeaders(): Promise<SectionHeaderData[]> {
  const results = await getAllSectionHeaders();
  return extractData<SectionHeaderData>(results);
}

export async function getSectionHeader(location: string): Promise<SectionHeaderData> {
  const results = await getAllSectionHeaders();
  const match = results.find((r) => (r.version.data as SectionHeaderData).location === location);
  if (!match) throw new Error(`Section header not found: ${location}`);
  return match.version.data as SectionHeaderData;
}

export async function getPageHeaders(): Promise<PageHeaderData[]> {
  const results = await getAllPageHeaders();
  return extractData<PageHeaderData>(results);
}

export async function getPageHeader(location: string): Promise<PageHeaderData> {
  const results = await getAllPageHeaders();
  const match = results.find((r) => (r.version.data as PageHeaderData).location === location);
  if (!match) throw new Error(`Page header not found: ${location}`);
  return match.version.data as PageHeaderData;
}

export async function getAdoptionSteps(): Promise<AdoptionStepData[]> {
  const results = await getLatestVersions('adoptionStep');
  return extractData<AdoptionStepData>(results);
}

export async function getVolunteerRoles(): Promise<VolunteerRoleData[]> {
  const results = await getLatestVersions('volunteerRole');
  return extractData<VolunteerRoleData>(results);
}

export async function getDonationOptions(): Promise<DonationOptionData[]> {
  const results = await getLatestVersions('donationOption');
  return extractData<DonationOptionData>(results);
}

export async function getWhyGreyhounds(): Promise<WhyGreyhoundData[]> {
  const results = await getLatestVersions('whyGreyhound');
  return extractData<WhyGreyhoundData>(results);
}

export async function getPostAdoptionSupport(): Promise<PostAdoptionSupportData[]> {
  const results = await getLatestVersions('postAdoptionSupport');
  return extractData<PostAdoptionSupportData>(results);
}

export async function getLostHoundSuggestions(): Promise<LostHoundSuggestionData[]> {
  const results = await getLatestVersions('lostHoundSuggestion');
  return extractData<LostHoundSuggestionData>(results);
}

export async function getAboutPage(): Promise<AboutPageData | undefined> {
  const results = await getLatestVersions('aboutPage');
  return extractSingle<AboutPageData>(results);
}

export async function getBeforeYouApply(): Promise<BeforeYouApplyData | undefined> {
  const results = await getLatestVersions('beforeYouApply');
  return extractSingle<BeforeYouApplyData>(results);
}
