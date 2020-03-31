

const bullConnectionConfig = {
  host: 'localhost',
  port: 6379,
  password: ''
};

const queue = {
  local: {
    prefix: "cosmetize_",
    queues: []
  },
  development: {
    prefix: "cosmetize_",
    queues: []
  }
}
export default queue;

/** Notes:
 *
 * The @max parameter only states the maximum number of works processed by time unit.
 * Whereas, @concurrency specifies how many processors can work concurrently on a given worker.
 *  eg. Concurrency of 5 only means that jobs will be processed at most 5 in parallel, it does not state anything regarding how many jobs are allowed to be processed by unit of time... for example, a job could take 10 seconds to complete,
 *      other 20, other 5, other 1, other 3. All of them could at a given time be processed concurrently with a concurrency of 5
 * @duration is waiting time between jobs. (minimum timeout)
 *  eg. if job A is taking 800ms to complete, if you specified 1000ms, so in that case it will wait additional 200ms before freeing process.
 */
