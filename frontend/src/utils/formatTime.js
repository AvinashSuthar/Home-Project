function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let result = "";

  if (hours > 0) {
    result += `${hours} ${hours === 1 ? "hour" : "hours"} `;
  }

  if (minutes > 0) {
    result += `${minutes} ${minutes === 1 ? "minute" : "minutes"} `;
  }

  if (remainingSeconds > 0 || result === "") {
    result += `${remainingSeconds} ${
      remainingSeconds === 1 ? "second" : "seconds"
    }`;
  }

  return result.trim();
}

export default formatTime;
