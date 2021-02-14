
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (sysUserPlatformFacade == null) var sysUserPlatformFacade = {};
sysUserPlatformFacade._path = '/dwr';
sysUserPlatformFacade.getSourceDataListForIndex = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'getSourceDataListForIndex', p0, p1, p2, p3, false, callback);
}
sysUserPlatformFacade.getRandomSourceDataList = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'getRandomSourceDataList', p0, false, callback);
}
sysUserPlatformFacade.addResReadRecord = function(p0, p1, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'addResReadRecord', p0, p1, callback);
}
sysUserPlatformFacade.delKeyWordsInfo = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'delKeyWordsInfo', p0, false, false, callback);
}
sysUserPlatformFacade.findResReadNotes = function(p0, p1, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'findResReadNotes', p0, p1, callback);
}
sysUserPlatformFacade.addResReadNotes = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'addResReadNotes', p0, p1, p2, p3, callback);
}
sysUserPlatformFacade.findResReadMarks = function(p0, p1, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'findResReadMarks', p0, p1, callback);
}
sysUserPlatformFacade.addKeyWordsInfo = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'addKeyWordsInfo', p0, false, false, callback);
}
sysUserPlatformFacade.addResReadMarks = function(p0, p1, p2, p3, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'addResReadMarks', p0, p1, p2, p3, callback);
}
sysUserPlatformFacade.getSourceBrowseHistory = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'getSourceBrowseHistory', p0, false, callback);
}
sysUserPlatformFacade.getCorrelationSourceDataList = function(p0, p1, p2, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'getCorrelationSourceDataList', p0, p1, p2, false, callback);
}
sysUserPlatformFacade.saveResSourceReview = function(p0, p1, p2, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'saveResSourceReview', p0, p1, p2, false, callback);
}
sysUserPlatformFacade.getSubjectHotSourceDataList = function(p0, p1, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'getSubjectHotSourceDataList', p0, p1, false, callback);
}
sysUserPlatformFacade.getKeyWordsInfoList = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'getKeyWordsInfoList', p0, false, false, callback);
}
sysUserPlatformFacade.getResSourceComtList = function(p0, p1, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'getResSourceComtList', p0, p1, false, callback);
}
sysUserPlatformFacade.saveResSourceReviewReply = function(p0, p1, p2, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'saveResSourceReviewReply', p0, p1, p2, false, callback);
}
sysUserPlatformFacade.cutoverLanguageForResourcesById = function(p0, p1, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'cutoverLanguageForResourcesById', p0, p1, false, callback);
}
sysUserPlatformFacade.getResourceTagInfoList = function(p0, p1, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'getResourceTagInfoList', p0, p1, false, callback);
}
sysUserPlatformFacade.deleteResReadNotes = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'deleteResReadNotes', p0, callback);
}
sysUserPlatformFacade.deleteResReadMarks = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'deleteResReadMarks', p0, callback);
}
sysUserPlatformFacade.getResSourceReviewReplyList = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'getResSourceReviewReplyList', p0, false, callback);
}
sysUserPlatformFacade.checkUserNameIsExit = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'checkUserNameIsExit', p0, callback);
}
sysUserPlatformFacade.saveResSourceGrade = function(p0, p1, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'saveResSourceGrade', p0, p1, false, false, callback);
}
sysUserPlatformFacade.saveSelfTag = function(p0, p1, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'saveSelfTag', p0, p1, false, callback);
}
sysUserPlatformFacade.saveSysUserStyle = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'saveSysUserStyle', p0, false, false, callback);
}
sysUserPlatformFacade.delTagInfo = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'delTagInfo', p0, false, callback);
}
sysUserPlatformFacade.checkEmailIsUse = function(p0, callback) {
  dwr.engine._execute(sysUserPlatformFacade._path, 'sysUserPlatformFacade', 'checkEmailIsUse', p0, callback);
}
