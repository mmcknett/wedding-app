import axios from "axios";
import { rsvpEndpoint } from './rsvp-client-config';

export default class RsvpClient {
    constructor(inviteCode) {
        let baseURL = (process.env.NODE_ENV === "development") ? rsvpEndpoint.urlDevelopment : rsvpEndpoint.url;
        
        this.inviteCode = inviteCode;
        this.axiosClient = axios.create({
            baseURL,
            timeout: 15000,
            headers: {
                'Authorization': `Bearer ${inviteCode}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            withCredentials: true
          });
    }

    async getRsvpData() {
        try {
            const { data } = await this.axiosClient.get('/guests');
            return data;
        } catch(err) {
            console.error('getGuests error:', err);
        }

        return null;
    }

    async rsvp(guests) {
        try {
            const response = await this.axiosClient.patch('/guests', { guests });
            return response;
        } catch(err) {
            console.error('rsvp error:', err);
        }
    }
}
