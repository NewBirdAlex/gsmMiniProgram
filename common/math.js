const math = {
    multiply(n1 = 0, n2 = 0) {
        var s1 = n1.toString()
        var s2 = n2.toString()
        var l1 = (s1.split('.')[1] || '').length
        var l2 = (s2.split('.')[1] || '').length
        var r1 = Number(s1.replace('.', ''))
        var r2 = Number(s2.replace('.', ''))
        return r1 * r2 / Math.pow(10, l1 + l2)
    },
    divide(n1 = 0, n2 = 0) {
        var s1 = n1.toString()
        var s2 = n2.toString()
        var l1 = (s1.split('.')[1] || '').length
        var l2 = (s2.split('.')[1] || '').length
        var r1 = Number(s1.replace('.', ''))
        var r2 = Number(s2.replace('.', ''))
        return this.multiply((r1 / r2), Math.pow(10, l2 - l1))
    },
    add(n1 = 0, n2 = 0) {
        var s1 = n1.toString()
        var s2 = n2.toString()
        var l1 = (s1.split('.')[1] || '').length
        var l2 = (s2.split('.')[1] || '').length
        var c = Math.abs(l1 - l2)
        var m = Math.pow(10, Math.max(l1, l2))

        var r1 = 0
        var r2 = 0
        if (c > 0) {
            var cm = Math.pow(10, c)
            if (l1 > l2) {
                r1 = Number(s1.replace('.', ''))
                r2 = Number(s2.replace('.', '')) * cm
            } else {
                r1 = Number(s1.replace('.', '')) * cm
                r2 = Number(s2.replace('.', ''))
            }
        } else {
            r1 = Number(s1.replace('.', ''))
            r2 = Number(s2.replace('.', ''))
        }
        return (r1 + r2) / m
    },
    subtract(n1 = 0, n2 = 0) {
        var l1 = (n1.toString().split('.')[1] || '').length
        var l2 = (n2.toString().split('.')[1] || '').length
        var m = Math.pow(10, Math.max(l1, l2))
        var n = (l1 >= l2) ? l1 : l2
        return Number(((n1 * m - n2 * m) / m).toFixed(n))
    }
}

module.exports = math