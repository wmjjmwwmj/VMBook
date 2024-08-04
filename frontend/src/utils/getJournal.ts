import apiClient from './axiosInstance';
import { SearchFilters } from '../components/SearchBar/SearchBar';

interface journalResponse {
  journal_id: string;
  user_id: string;
  time_created: string;
  time_modified: string;
  description?: string;
  starred?: string;
  tags?: string;
  is_public?: string;
  text_content?: string;
}

interface JournalUpdate {
  title?: string;
  starred?: boolean;
  tags?: string[];
  is_public?: boolean;
  text_content?: string;
}


const handleJournalDetails = async ({ journalId }: {  journalId: string }): Promise< string > => {

  try {
    const response = await apiClient.get<journalResponse>(url);
    if (response.data.text_content === undefined) {
      console.error('Fetched blank journal:', response.data);
      return "Fetched blank journal";
    } else {
      console.log("Fetched journal:", response.data.text_content);
      return response.data.text_content; 
    }
    
  } catch (error) {
    console.error('Error fetching journal:', error);
    return "Error fetching journal";
  }
};

// TODO
const handleJournalUpdate = async ({ journalId }: {  journalId: string }): Promise< string > => {
  console.log("To fetch journal of:", journalId);
  let url =  `/users/${window.user_id}/journals`;

  try {
    const response = await apiClient.get<journalResponse>(url);
    if (response.data.text_content == null) {  
      console.error('Fetched blank journal:', response.data);
      return "Fetched blank journal";
    } else {
      console.log("Fetched journal:", response.data.text_content);
      return response.data.text_content; 
    }
    
  } catch (error) {
    console.error('Error fetching journal:', error);
    return "Error fetching journal";
  }
};

export default handleJournalDetails;
