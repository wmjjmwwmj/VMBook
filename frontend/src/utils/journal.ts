import axios from 'axios';

interface JournalEntry {
  id: number;
  datetime: string;
  content?: string | "";
  href?: string | "https://ant.design";
  title?: string | "Undefined";
  tags?: string[] | [];
  description?: string | "";
}

interface GetUserJournalOptions {
  starred: boolean;
  device: string | undefined;
  fromDate: string | null;
  toDate: string | null;
  content: string;
  limit?: number;
}

async function getUserJournal(userId: string, options?: GetUserJournalOptions): Promise<JournalEntry[]> {
  try {
    let url = `/users/${userId}/journals/`;

    // 构建查询参数
    if (options) {
      const params = new URLSearchParams();
      if (options.starred) {
        params.append('starred', 'true');
      }
      if (options.device) {
        params.append('device', options.device);
      }
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      if (options.fromDate) {
        params.append('fromDate', options.fromDate);
      }
      if (options.toDate) {
        params.append('toDate', options.toDate);
      }
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url);
    console.log('User journal:', response.data);
    return response.data as JournalEntry[]; // 明确返回类型
  } catch (error) {
    console.error('Error fetching user journal:', error);
    throw error;
  }
}


async function updateUserJournal(userId: string, entry: JournalEntry): Promise<void> {
    try {
        const url = `/api/journal/${userId}/${entry.id}`;
        const response = await axios.put(url, entry);
        console.log('User journal updated:', response.data);
    } catch (error) {
        console.error('Error updating user journal:', error);
        throw error;
    }
}


async function deleteUserJournal(userId: string, entryId: number): Promise<void> {
    try {
        const url = `/api/journal/${userId}/${entryId}`;
        const response = await axios.delete(url);
        console.log('User journal deleted:', response.data);
    } catch (error) {
        console.error('Error deleting user journal:', error);
        throw error;
    }
}


async function addUserJournal(userId: string, entry: JournalEntry): Promise<void> {
    try {
        const url = `/api/journal/${userId}`;
        const response = await axios.post(url, entry);
        console.log('User journal added:', response.data);
    } catch (error) {
        console.error('Error adding user journal:', error);
        throw error;
    }
}

export default getUserJournal;
export { updateUserJournal, deleteUserJournal, addUserJournal };
export type { JournalEntry, GetUserJournalOptions };