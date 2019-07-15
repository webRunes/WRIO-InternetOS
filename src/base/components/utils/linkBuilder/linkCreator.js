export default (data = {}, title, queryString) => {
    window.history.pushState(data,title,window.location.pathname + queryString)
}