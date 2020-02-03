const getRedisKey = (redisClient, redisKey) => {
    return new Promise((resolve, reject) => {
        return redisClient.get(redisKey, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!res ? res : false);
            }
        })
    });
}

const setRedisKey = (redisClient, key1, key2, val) => {
    return new Promise((resolve, reject) => {
        return redisClient.set(`${key1}/${key2}`, val, "ex", 60 * 20, (err, res) => err ? reject(err) : resolve(res));
    });
}

const deleteRedisKey = (redisClient, redisKey) => {
    return new Promise((resolve, reject) => {
        return redisClient.del(redisKey, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    });
}

module.exports = {
    getRedisKey,
    setRedisKey,
    deleteRedisKey,
};