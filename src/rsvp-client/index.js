import axios from "axios";
import { rsvpEndpoint } from './rsvp-client-config';

export default class RsvpClient {
    constructor(inviteCode) {
        // let baseURL = (process.env.NODE_ENV === "development") ? rsvpEndpoint.urlDevelopment : rsvpEndpoint.url;
        let baseURL = rsvpEndpoint.url;
        
        this.inviteCode = inviteCode;
        this.axiosClient = axios.create({
            baseURL,
            timeout: 5000,
            headers: {
                'Authorization': `Bearer ${inviteCode}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            withCredentials: true
          });
    }

    async getGuests() {
        try {
            const { data } = await this.axiosClient.get('/guests');
            return data.guests;
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
