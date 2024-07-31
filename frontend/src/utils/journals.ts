import axios from 'axios';

interface JournalResponse {
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
  contains: string;
}

async function getUserJournal(userId: string, options?: GetUserJournalOptions, offset?: number, limit?:number): Promise<JournalResponse[]> {
  try {
    let url = `http://192.168.0.34:8000/users/${userId}/journals`;

    // 构建查询参数
    if (options) {
      const params = new URLSearchParams();
      if (options.starred) {
        params.append('starred', 'true');
      }
      if (options.device) {
        params.append('device', options.device);
      }
      if (options.fromDate) {
        params.append('fromDate', options.fromDate);
      }
      if (options.toDate) {
        params.append('toDate', options.toDate);
      }
      if (options.contains) {
        params.append('contains', options.contains);
      }
      if (offset) {
        params.append('offset', offset.toString());
      }
      if (limit) {
        params.append('limit', limit.toString());
      }
      url += `?${params.toString()}`;
      console.log('url:', url);
    }

    const response = await axios.get(url);
    return response.data as JournalResponse[];
  } catch (error) {
    console.error('Error fetching user journal:', error);
    throw error;
  }
}


async function updateUserJournal(userId: string, entry: JournalResponse): Promise<void> {
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


async function addUserJournal(userId: string, entry: JournalResponse): Promise<void> {
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
export type { JournalResponse, GetUserJournalOptions };