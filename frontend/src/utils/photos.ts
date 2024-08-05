import axios from "axios";
import JSZip from "jszip";

interface PhotoResponse {
    photo_id: string;
    time_created: string;
    url?: string | "";
    href?: string | "https://ant.design";
    title?: string | "Undefined";
    tags?: string[] | [];
    description?: string | "";
  }
  
  interface GetUserPhotoOptions {
    starred?: boolean;
    device?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    contains?: string | null;
  }

  async function getUserPhoto(userId: string, options?: GetUserPhotoOptions, offset?: number, limit?:number): Promise<PhotoResponse[]> {
    try {
      let url = `http://192.168.0.34:8000/users/${userId}/photos`;
  
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
      return response.data as PhotoResponse[];
    } catch (error) {
      console.error('Error fetching user journal:', error);
      throw error;
    }
  }


async function deleteUserPhotos(userId: string, photo_ids: string[]): Promise<any> {
    try {
        const baseUrl = `http://192.168.0.34:8000/users/${userId}/photos`;
        const deletePromises = photo_ids.map(photoId => axios.delete(`${baseUrl}/${photoId}`));

        const responses = await Promise.all(deletePromises);

        responses.forEach((response, index) => {
            if (response.status !== 200) {
                console.error(`Failed to delete photo ${photo_ids[index]}`);
            }else{
                console.log(`Photo ${photo_ids[index]} deleted`);
            }
        });
    } catch (error) {
        console.error('Error deleting user photos:', error);
        throw error;
    }
}


async function describeUserPhoto(userId: string, photo_id: string): Promise<PhotoResponse> {
    try {
        const baseUrl = `http://192.168.0.34:8000/users/${userId}/photos/${photo_id}/analyze`;

        const response = await axios.get(baseUrl);

        if (response.status !== 200) {
            console.error(`Failed to describe photo ${photo_id}`);
        }

        return response.data as PhotoResponse;

    } catch (error) {
        console.error('Error updating user photo:', error);
        throw error;
    }
}



async function downloadSelectedPhotos(userId: string, photoUrls: string[]): Promise<Blob> {
    try {
        const zip = new JSZip();

        // Download each photo and add to the zip file
        const downloadPromises = photoUrls.map(async (url, index) => {
            const response = await axios.get(`http://${url}`, {
                responseType: 'blob',
            });
            zip.file(`photo_${index}.png`, response.data);
        });

        await Promise.all(downloadPromises);

        // Generate the zip file as a Blob
        const zipBlob = await zip.generateAsync({ type: 'blob' });

        return zipBlob;

    } catch (error) {
        console.error('Error downloading user photos:', error);
        throw error;
    }
}


async function generateJournalFromPhotos(userId: string, photoIds: string[]): Promise<any> {
    try {
        const baseUrl = `http://192.168.0.34:8000`;

        // Prepare the request body
        const body = {
            photo_ids: photoIds,
        };

        // Make a POST request to generate the journal
        const response = await axios.post(
            `${baseUrl}/users/${userId}/journals/generate`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status !== 200) {
            console.error('Failed to generate journal');
        } 

        return response.data;

    } catch (error) {
        console.error('Error generating journal from photos:', error);
        throw error;
    }
}

export default getUserPhoto;
export { deleteUserPhotos, describeUserPhoto, downloadSelectedPhotos, generateJournalFromPhotos };
export type { PhotoResponse };