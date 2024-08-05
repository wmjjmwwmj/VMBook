import apiClient from './axiosInstance';

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


const handleJournalDetails = async ({ journalId }: {  journalId: string }): Promise< string | undefined > => {

  let url =  `/users/${window.user_id}/journals/${journalId}`;
  console.log("To fetch journal of:", journalId);
  try {
    const response = await apiClient.get<journalResponse>(url);
    if (response.data.description === undefined) {
      console.error('Fetched blank journal:', response.data.description);
      return "Fetched blank journal";
    } else {
      console.log("Fetched journal:", response);

      return response.data.description; 

    }
    
  } catch (error) {
    console.error('Error fetching journal:', error);
    return "Error fetching journal";
  }
};

// TODO
const handleJournalUpdate = async ({ journalId, journalContent }: {  journalId: string, journalContent: string | undefined }): Promise< boolean > => {
  console.log("To update journal of:", journalId);
  let url =  `/users/${window.user_id}/journals/${journalId}`;

  const journalUpdate: JournalUpdate = {
    text_content: journalContent,
  };

  try {
    const response = await apiClient.put<journalResponse>(url, journalUpdate);
    if (response.status === 200) {  
      console.error('Update successfully!');
      return true;
    } else {
      console.log("Update failure");
      return false; 
    }
    
  } catch (error) {
    console.error('Error fetching journal:', error);
    return false;
  }
};

export default handleJournalDetails; 
export  {handleJournalUpdate} ;
