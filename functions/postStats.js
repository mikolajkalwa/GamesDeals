const axios = require('axios');

const postStats = (id, serverCount) => {
    axios({
        method: 'post',
        url: `https://discordbots.org/api/bots/${id}/stats`,
        headers: {
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5NjQ2NjgzNjMzMTQyOTg4OSIsImJvdCI6dHJ1ZSwiaWF0IjoxNTI5MDAwNzYxfQ.ky1Gy2gfiVbn6phFA_oHRnyuwFStZmoLjQ_EJCS6NSw',
        },
        data: {
            server_count: serverCount,
        },
    });
};

module.exports = { postStats };
