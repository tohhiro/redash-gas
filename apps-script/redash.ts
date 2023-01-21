interface RedashType {
  WAIT_TIMEOUT: number;
  getRedashJson: (pUserId: string) => getRedashJsonType[];
  fetch_latest_query_result: (
    redash_query_id: number,
    params: string
  ) => getRedashJsonType[];
  refresh: (redash_query_id: number, params: string) => refreshType;
  poll_job: (job: any) => poll_jobType;
  fetch_json: (method: any | undefined, url: string) => fetch_jsonType[];
}

interface refreshType {
  status: number;
  error: number | string | null;
  id: string;
  query_result_id: number | null;
  updated_at: number | string;
}

interface getRedashJsonType {
  // 返ってくるオブジェクトの型を定義
}

interface poll_jobType {
  job: {
    status: number;
    error: string;
    id: string;
    query_result_id: number | string | null;
    updated_at: number | string;
  };
}

interface fetch_jsonType {
  query_result: {
    retrieved_at: string;
    query_hash: string;
    query: string;
    runtime: number;
    data: { rows: Object[]; columns: Object[] };
    id: number;
    data_source_id: number;
  };
}

class Redash implements RedashType {
  // REDASH_HOST  RedashのURL
  // USER_API_KEY 個人のAPI Key
  // QUERY_ID  クエリのID
  WAIT_TIMEOUT: number;

  //Redash APIの固定情報
  constructor(
    private REDASH_HOST: string,          // インスタンス時にsecret.ts、.envなどからRedashのHOSTを読み込む
    private USER_API_KEY: string,         // インスタンス時にsecret.ts、.envなどからRedashのユーザーAPI KEYを読み込む
    private QUERY_ID: number              // インスタンス時にsecret.ts、.envなどから取得したいRedashのクエリIDを読み込む
  ) {
    this.WAIT_TIMEOUT = 60; // 結果が更新されるまで待機時間のタイムアウト（sec）
  }

  // Redashからデータを取得する
  getRedashJson() {  // パラメータを受け取る場合は、引数に params: string
    // RedashのクエリIDとp_user_idから最新情報を取得
    let results = this.fetch_latest_query_result(this.QUERY_ID); // パラメータを受け取る場合は、第二引数に params: string
    return results;
  } //getRedashJson(pUserId)

  // クエリの最新結果取得
  fetch_latest_query_result(redash_query_id: number) { // パラメータを受け取る場合は、第二引数に params: string
    let job = this.poll_job(this.refresh(redash_query_id)); // パラメータを受け取る場合は第二引数に params
    let url =
      this.REDASH_HOST +
      "/api/queries/" +
      redash_query_id +
      "/results/" +
      job.query_result_id +
      ".json";
    let json = this.fetch_json("get", url);

    return json["query_result"]["data"]["rows"];
  } // fetch_latest_query_result(redash_query_id)

  // 結果を更新するようにRedashへリクエスト
  refresh(redash_query_id: number) {// パラメータを受け取る場合は、第二引数に params: string
    let url =
      this.REDASH_HOST +
      "/api/queries/" +
      redash_query_id +
      "/refresh" // パラメータを受け取る場合は + params
    let json = this.fetch_json("post", url);
    return json.job;
  } // refresh(redash_query_id, params)

  // 結果が更新されるまで待機
  poll_job(job) {
    let i = 0;
    while (i < this.WAIT_TIMEOUT) {
      let url: string = this.REDASH_HOST + "/api/jobs/" + job.id;
      let json = this.fetch_json("get", url);
      if (json.job.status == 3 || json.job.status == 4) {
        return json.job;
      }
      i++;
      Utilities.sleep(1000);
    } // endwhile
    return job;
  } // poll_job(job)

  // JSON取得
  fetch_json(method: any | undefined, url: string) {
    let response = UrlFetchApp.fetch(url, {
      method: method,
      muteHttpExceptions: true,
      headers: {
        Authorization: "Key " + this.USER_API_KEY,
      },
    });
    return JSON.parse(response.getContentText());
  } // fetch_json(method, url)
} // class Redash