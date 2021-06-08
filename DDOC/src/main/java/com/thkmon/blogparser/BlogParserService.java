package com.thkmon.blogparser;

import java.net.URLDecoder;
import java.sql.SQLException;
import java.util.Hashtable;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.thkmon.common.properties.OptionProperties;
import com.thkmon.common.prototype.StringMap;
import com.thkmon.common.prototype.StringMapList;
import com.thkmon.common.util.HttpUtil;
import com.thkmon.common.util.JsonUtil;

@Service
public class BlogParserService {
	
	private static final String naverUserId = OptionProperties.optionProperties.get("naver_user_id");
	private static final String wordpressUrl = OptionProperties.optionProperties.get("wordpress_url");
	private static final int beginPageNum = 1;
	private static final int endPageNum = 1;
	private static final int countPerPage = 10; // 5, 10, 15, 20, 30 가능
	
	/**
	 * 최근 포스트 인서트 기능
	 */
	public boolean insertRecentPosts() throws Exception {
		boolean result = false;
		
		StringMapList logNoList = new StringMapList();
		for (int i = beginPageNum; i <= endPageNum; i++) {
			logNoList = addNaverBlogArticleNumbers(logNoList, i);
		}

		logNoList = logNoList.reverse();

		System.out.println(logNoList);

		BlogParserMapper wordpressMapper = new BlogParserMapper();
		
		int totalCount = logNoList.size();
		for (int i = 0; i < totalCount; i++) {
			StringMap map = logNoList.get(i);
			result = wordpressMapper.insertWordpressPostFromNaverBlogPost(wordpressUrl, naverUserId, map);
		}
		
		return result;
	}
	
	/**
	 * 특정 페이지의 포스트 정보들을 가져온다.
	 * 
	 * @param logNoList
	 * @param pageNumber
	 * @return
	 * @throws Exception
	 */
	private StringMapList addNaverBlogArticleNumbers(StringMapList logNoList, int pageNumber) throws SQLException, Exception {
		Hashtable<String, String> param = new Hashtable<String, String>();
		param.put("blogId", naverUserId);
		param.put("viewdate", "");
		param.put("currentPage", String.valueOf(pageNumber));
		param.put("categoryNo", "");
		param.put("parentCategoryNo", "");
		param.put("countPerPage", String.valueOf(countPerPage));

		String strUrl = "https://blog.naver.com/PostTitleListAsync.nhn";
		String result = HttpUtil.postHttp(strUrl, param, "UTF-8");

		JSONObject jsonObj = JsonUtil.parseJsonObject(result);
		JSONArray jsonArray = JsonUtil.getJSONArray(jsonObj, "postList");
		if (jsonArray != null) {
			int len = jsonArray.length();
			for (int i = 0; i < len; i++) {
				JSONObject oneJsonObj = jsonArray.getJSONObject(i);
				if (oneJsonObj == null) {
					continue;
				}

				String logNo = JsonUtil.getString(oneJsonObj, "logNo");
				String title = JsonUtil.getString(oneJsonObj, "title");
				if (title != null) {
					if (title.indexOf("%") > -1 || title.indexOf("+") > -1) {
						title = URLDecoder.decode(title, "UTF-8");
					}
				}
				
				String categoryNo = JsonUtil.getString(oneJsonObj, "categoryNo");
				// String parentCategoryNo = JsonUtil.getString(oneJsonObj, "parentCategoryNo");
				// String sourceCode = JsonUtil.getString(oneJsonObj, "sourceCode");
				// String commentCount = JsonUtil.getString(oneJsonObj, "commentCount");
				// String readCount = JsonUtil.getString(oneJsonObj, "readCount");
				String addDate = JsonUtil.getString(oneJsonObj, "addDate");
				// String openType = JsonUtil.getString(oneJsonObj, "openType");
				// String searchYn = JsonUtil.getString(oneJsonObj, "searchYn");
				// String greenReviewBannerYn = JsonUtil.getString(oneJsonObj, "greenReviewBannerYn");
				// String memologMovingYn = JsonUtil.getString(oneJsonObj, "memologMovingYn");
				// String isPostSelectable = JsonUtil.getString(oneJsonObj, "isPostSelectable");
				// String isPostNotOpen = JsonUtil.getString(oneJsonObj, "isPostNotOpen");
				// String isPostBlocked = JsonUtil.getString(oneJsonObj, "isPostBlocked");
				// String isBlockTmpForced = JsonUtil.getString(oneJsonObj, "isBlockTmpForced");

				StringMap map = new StringMap();
				map.put("logNo", logNo);
				map.put("title", title);
				map.put("categoryNo", categoryNo);
				// map.put("parentCategoryNo", parentCategoryNo);
				// map.put("sourceCode", sourceCode);
				// map.put("commentCount", commentCount);
				// map.put("readCount", readCount);
				map.put("addDate", addDate);
				// map.put("openType", openType);
				// map.put("searchYn", searchYn);
				// map.put("greenReviewBannerYn", greenReviewBannerYn);
				// map.put("memologMovingYn", memologMovingYn);
				// map.put("isPostSelectable", isPostSelectable);
				// map.put("isPostNotOpen", isPostNotOpen);
				// map.put("isPostBlocked", isPostBlocked);
				// map.put("isBlockTmpForced", isBlockTmpForced);

				logNoList.addNotDupl(map, "logNo");
			}
		}

		return logNoList;
	}
	
	
	/**
	 * 특정 포스트 업데이트 기능
	 * 
	 * @param postNo
	 * @throws SQLException
	 * @throws Exception
	 */
	public boolean updateOnePost(String postNo) throws SQLException, Exception {
		BlogParserMapper wordpressMapper = new BlogParserMapper();
		return wordpressMapper.updateWordpressPostFromNaverBlogPost(wordpressUrl, naverUserId, postNo);
	}
}