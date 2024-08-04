import apiClient from './axiosInstance';
import handleJournalDetails from './getJournal';


const handleGenerationJournal = async ({ selectedPhotos }: {  selectedPhotos: string[] | undefined}): Promise<{ success: boolean, message: string }> => {
  console.log("To generate journal for photos:", selectedPhotos);
  let url =  `/users/${window.user_id}/journals/${journalId}`;
  console.log("url:", url);

  try {
    const body = {
      photos: selectedPhotos
    };
    const response = await apiClient.post<journalResponse>(url, body);

    if (response.data.journal_id === undefined) {
      console.error('Fetched blank journal:', response.data);
      return { success: false, message: "" };
    } else {
      console.log("Fetched journal:", response.data.text_content);
      return { success: true, message: response.data.journal_id };
    }
    
  } catch (error) {
    // 将错误信息打印到控制台，并不会导致程序中断或停止执行。它仅用于记录错误或警告信息，帮助开发者进行调试。
    console.error('Error fetching journal:', error);
    return { success: false, message: "" };
  }
};


export default handleGenerationJournal;
