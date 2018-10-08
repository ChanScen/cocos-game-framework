/**
 * 【框架】全局方法类
 * - 封装一些重要的/常用的方法
 */
export default class G {
    /**
     * 获取一个随机整数，范围：[min,max)
     * @param {number} min
     * @param {number} max
     * @returns {number}
     * @static
     */
    static get_random_int(min, max) {
        let rn = Math.floor(Math.random() * (max - min) + min)
        return rn
    }

    /**
     * 获取一个随机小数，范围：[min,max)
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     * @static
     */
    static get_random_float(min, max) {
        let rn = Math.random() * (max - min) + min
        return rn
    }

    /**
     * 从数组中获取一个随机值，概率相等
     * @param {Array} array 
     * @returns {undefined | any}
     */
    static get_random_item_form_array(array) {
        if (array.length === 0) {
            return
        } else {
            let rn = G.get_random_int(0, array.length)
            return array[rn]
        }
    }

    /**
     * 依次运行多个promise
     * - 考虑到async/await各个平台的支持情况不同，尽量不要在代码中使用
     * - 默认每个promise，resolve一个无关的返回值；如果返回值是有用的，则无法使用这个方法
     * - 我也不知道为啥这样写就能成功。。。嗯。。。
     * - 实际使用起来感觉也挺复杂的（参考MRes.load_chain()），以后再改动吧。
     * @param {Array<Function>} promise_array 由于promise建立后立即执行的特性（坑），因此需要使用一个箭头函数进行包装
     * @returns {Promise}
     */
    static run_promise_chain(promise_array) {
        let p = Promise.resolve()
        for (let promise of promise_array) {
            p = p.then(promise)
        }
        return p
    }

    /**
     * 依次运行多个promise（有缺点）
     * - 使用递归算法
     * - 【注意】 异步操作无法使用尾递归优化
     * - 【注意】 异步操作无法返回一个正常的返回值（异步函数会直接返回undefined）,应该无法在此函数后使用then()
     * @param {Array<Function>} promise_array
     * @returns {undefined}
     */
    static run_promise_chain_with_recursive(promise_array) {
        if (promise_array.length === 0) { return }
        let a = promise_array.shift()
        a().then(() => {
            G.run_promise_chain_with_recursive(promise_array)
        })
    }

    /**
     * 将一个多次执行的方法放到多帧中执行，避免单帧中消耗过多性能造成卡顿
     * - 【思路】使用cc.Component.schedule()方法，在interval参数为0时表示逐帧调用
     * @param {Function} f 需要执行的方法
     * @param {cc.Component} nc 执行方法的节点脚本
     * @param {number} all_count 执行的总数
     * @param {number} each_count 每帧执行的次数
     * @static
     */
    static run_by_each_frame(f, nc, all_count, each_count = 1) {
        nc.schedule(() => {
            for (let i = 0; i < each_count; i++) {
                f()
            }
        }, 0, all_count - 1)
    }

    /**
     * 间隔帧执行
     * @param {Function} f 
     * @param {cc.Component} nc
     * @param {number} all_count 执行的总数 
     * @param {number} interval 间隔帧，最低为1，表示连续帧
     * @static
     */
    static run_by_interval_frame(f, nc, all_count, interval = 1) {
        let c = 0
        nc.schedule(() => {
            if (c === 0) {
                f()
            }
            c += 1
            if (c >= interval) {
                c = 0
            }
        }, 0, (all_count - 1) * interval)
    }

    /** 
     * 获取节点的世界坐标
     * @param {cc.Node} node
     * @returns {cc.Vec2}
     */
    static get_node_world_position(node) {
        return node.parent.convertToWorldSpaceAR(node.position)
    }

    /**
     * 将角度转换为弧度
     * @param {number} angle 
     * @returns {number}
     * @static
     */
    static trans_angle_to_radian(angle) {
        return angle * (Math.PI / 180)
    }

    /**
     * 将弧度转换为角度
     * @param {number} radian 
     * @returns {number}
     * @static
     */
    static trans_radian_to_angle(radian) {
        return radian / (Math.PI / 180)
    }
}