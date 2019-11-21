const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const formatTime = (seconds) => {
  if (!Number.isInteger(seconds)) return false;
  if (seconds < 3600) {
    return new Date(seconds * 1000).toISOString().replace(/.*(\d{2}:\d{2}).*/, (match, p1) => p1);
  } else {
    return new Date(seconds * 1000).toISOString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, (match, p1) => p1);
  };
};

const getSortedIds = (notes) => {
  return Object.keys(notes).sort((a, b) => {
    return notes[a].timestamp - notes[b].timestamp;
  });
};

const getCurrentVideoId = () => {
	return getParameterByName("v");
};
