export type EventType = 'Annual' | 'Fundraiser' | 'Monthly' | 'Weekly' | 'Seasonal' | 'Special';
export type EventRecurrence = 'once' | 'weekly' | 'monthly';

export interface EventData {
  id: number;
  title: string;
  startDate: string;
  endDate: string | null;
  recurrence: EventRecurrence;
  time: string;
  location: string;
  type: EventType;
  description: string;
  longDescription: string;
  archived: boolean;
  showUpcoming: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SectionHeaderData {
  label?: string;
  title: string;
  description?: string;
}

export interface AdoptionStepData {
  step: number;
  title: string;
  description: string;
  details: string[];
  icon: string;
}

export interface VolunteerRoleData {
  title: string;
  description: string;
  icon: string;
  commitment: string;
}

export interface DonationOptionData {
  title: string;
  description: string;
  icon: string;
}

export interface ContentTypeMap {
  sectionHeader: SectionHeaderData;
  adoptionStep: AdoptionStepData;
  volunteerRole: VolunteerRoleData;
  donationOption: DonationOptionData;
}

export type ContentType = keyof ContentTypeMap;
