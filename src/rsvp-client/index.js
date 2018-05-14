import axios from "axios";
import { rsvpEndpoint } from './srvp-client-config';

export default class RsvpClient {
    constructor(inviteCode) {
        this.inviteCode = inviteCode;
        this.axiosClient = axios.create({
            baseURL: rsvpEndpoint.url,
            timeout: 5000,
            headers: {'Authorization': `Bearer ${inviteCode}`}
          });
    }

    async getGuests() {
        const guests = await this.axiosClient.get('/guests');
        return JSON.parse(guests);
    }
}
