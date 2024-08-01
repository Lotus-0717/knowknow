//驗證是否為正確URL
function isURL(str) {
  var reg =
    /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
  if (reg.test(str)) {
    return true;
  }
  return false;
}
