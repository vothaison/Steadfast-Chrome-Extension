if ('LOG' in window) throw {
    ERROR: "Cannot override property LOG of window. LOG is ",
    LOG: window.LOG
}

window.LOG = console.log.bind(console);