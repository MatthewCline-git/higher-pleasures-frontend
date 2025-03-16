import apiClient from "./client";

export interface Entry {
  user_id: string;
  user_activity_id: number;
  date: Date;
  duration_minutes: number;
  raw_input: string;
}

export interface UserActivitySummary {
  full_name: string;
  activities: string[];
  dates: string[];
  data: {
    [date: string]: {
      [activity: string]: number;
    };
  };
}

const dbService = {
  getAllEntries: async (): Promise<Entry[]> => {
    return apiClient.get("/db/entries");
  },
  getUserEntries: async (userId: string): Promise<Entry[]> => {
    return apiClient.get(`/db/${userId}/entries`);
  },
  getUserActivitySummary: async (
    userId: string,
  ): Promise<UserActivitySummary> => {
    return apiClient.get(`/db/${userId}/entries/activity-summary`);
  },
};

export default dbService;
