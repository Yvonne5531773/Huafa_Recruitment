
function scoreChange(a){
    function e(){
        var b = document.getElementById("doughnutChartCanvas").getContext("2d");
        new Chart(b).Doughnut(c,d),
            $("#doughnutChartCanvas").css({'width':120,'height':120});
            $("#resumeScore .scoreVal span").text(a).parent().fadeIn(200),
            a>=50?$("#resumeScore .which span").html('<a href="/index">马上去投递</a>'):$("#resumeScore .which span").html("<a>马上去完善</a>")
    }
    var b=360* parseInt(a)/100,
        c=[{value:b,color:"#009a6d"},{value:360-b,color:"#ffffff"}],
        d={percentageInnerCutout:80,segmentShowStroke:!1,animationEasing:"easeOutQuart"};
    setTimeout(e,300)
}

function changeAllIds(a){
    var c,d,e,f,b=JSON.parse(a);
    $("#resumeId").val(b.resumeId.n),
        c=b.expId,
        d=b.eduId,
        e=b.projectId,
        f=b.showId,
        $("#workExperience .wlist li").each(
            function(){
                var b,a=$(this).attr("data-id");
                for(b=0;b<c.length;b++)
                    if(a==c[b].o) $(this).attr("data-id",c[b].n);
            }),
        $("#projectExperience .plist li").each(
            function(){
                var b,a=$(this).attr("data-id");
                for(b=0;b<e.length;b++)
                    if(a==e[b].o)
                        $(this).attr("data-id",e[b].n)
            }),
        $("#educationalBackground .elist li").each(
            function(){
                var b, a = $(this).attr("data-id");
                for(b=0;b<d.length;b++)
                    if(a==d[b].o)
                        $(this).attr("data-id",d[b].n)
            }),
        $("#worksShow .slist li").each(
            function(){
                var b,a=$(this).attr("data-id");
                for(b=0;b<f.length;b++)
                    if(a==f[b].o)
                        $(this).attr("data-id",f[b].n)
            }),
        $("#certificate .clist li").each(
            function(){
                var b,a=$(this).attr("data-id");
                for(b=0;b<f.length;b++)
                    if(a==f[b].o)
                        $(this).attr("data-id",f[b].n)
            })
}

function openYear(a){
    $(".profile_select_normal").removeClass("select_focus"),
        $(".boxUpDown").hide(),
        $(".select_"+a).addClass("select_focus"),
        $(".box_"+a).show()
}

function selectYear(a,b){
    $(".select_"+a).val(b).css("color","#333").removeClass("select_focus"),
        $("."+a).val(b),$(".box_"+a).hide()
}

function suggestCompany(a,b){
    var c="";
    $.ajax(
        {
            type:"POST",
            async:!1,
            url:ctx+"/c/companySearchCompanyLs.json",
            data:{kd:a},
            dataType:"json"
        })
        .done(function(a){
            c = a;
        }),
        $(b).autocomplete({source : c});
}

function suggestPosition(a,b){
    var c="";
    $.ajax(
        {
            type:"POST",
            async:!1,
            url:ctx+"/jobs/listLs",
            data:{pl:a},
            dataType:"json"
        })
        .done(function(a){
            if(a.success)
                (c=a.content.result)
        }),
        $(b).autocomplete({source:c})
}

function click_scroll(a){
    var b=$("#"+a).offset();
    switch(a){
        case "basicInfo":
            $("#basicInfo .basicEdit").trigger("click");break;
        case "expectJob":
            $("#expectJob .expectAdd").trigger("click");break;
        case "workExperience":
            $("#workExperience .experienceAdd").trigger("click");break;
        case "family":
            $("#family .familyAdd").trigger("click");break;
        case "projectExperience":
            $("#projectExperience .projectAdd").trigger("click");break;
        case "educationalBackground":
            $("#educationalBackground .educationalAdd").trigger("click");break;
        case "selfDescription":
            $("#selfDescription .descriptionAdd").trigger("click");break;
        case "worksShow":
            $("#worksShow .workAdd").trigger("click");break;
        case "certificate":
            $("#certificate .certificateAdd").trigger("click");break;
        case "strength":
            $("#strength .strengthAdd").trigger("click");break;
        case "prize":
            $("#prize .prizeAdd").trigger("click");break;
        default:
            return
    }
    $("body,html").animate({ scrollTop: b.top }, 400 , function(){
        $("#"+a).animate({borderColor:"#e46a4a"}, 300, function(){
            $(this).animate({borderColor:"transparent"})
        })
    })
}

function getOperationTime(date) {
    var updateDate = new Date(date);
    if (!updateDate) {
        return '';
    }
    var month = updateDate.getMonth() < 10 ? '0' + updateDate.getMonth() : updateDate.getMonth();
    month ++;
    var day = updateDate.getDate() < 10 ? '0' + updateDate.getDate() : updateDate.getDate();
    var hour = updateDate.getHours() < 10 ? '0' + updateDate.getHours() : updateDate.getHours();
    var minute = updateDate.getMinutes() < 10 ? '0' + updateDate.getMinutes() : updateDate.getMinutes();
    //   var second = updateDate.getSeconds() < 10 ? '0' + updateDate.getSeconds() : updateDate.getSeconds();
    var time = updateDate.getFullYear() + '/'
        + month + '/' + day;
    //   + ':' + second;
    return time;
}

function img_check(a,b,c){
    var pic = $("#headPic").val(),
        applicantname = $('#applicantname').val();
    this.AllowExt = ".jpg,.gif,.jpeg,.png,.pjpeg",
        this.FileExt = pic.substr(pic.lastIndexOf(".")).toLowerCase();
    if(0 != this.AllowExt){
        if(-1 == this.AllowExt.indexOf(this.FileExt)){
            errorTips("只支持jpg、gif、png、jpeg格式，请重新上传", "上传头像")
        }else {
            $.ajaxFileUpload(
                {
                    url: b,
                    secureuri: !1,
                    fileElementId: c,
                    data: {userid: applicantname},
                    dataType: "json",
                    type: 'post',
                    success: function (res) {
                        if (!res.err) {
                            var icon = res.fileSrc;
                            $.ajax({
                                url: "resume/upsertResume",
                                type: "POST",
                                data: {
                                    _id: $('#_id').val(),
                                    icon: icon
                                },
                                dataType: "json"
                            }).done(function (res) {
                                if (res.error) {
                                    errorTips("上传失败，请重新上传", "上传头像");
                                }else{
                                    $("#portraitShow img").attr("src", "/" + icon), $("#basicInfo .basicShow img").attr("src", "/" + icon), $("#portraitNo").hide(), $("#portraitShow").show();
                                    scoreChange(res.completeScore);
                                    $("#_id").val(res._id);
                                }
                            });
                        } else errorTips("上传失败，请重新上传", "上传头像")
                    },
                    error: function () {
                        errorTips("上传失败，请重新上传", "上传头像")
                    }
                });
        }
    }
}

function file_check(obj,action_url,id) {
    var userId;
    $("#loadingImg").css("visibility", "visible"),
        obj = $("#" + id),
        userId = $("#userid").val(),
        this.AllowExt = ".doc,.docx,.pdf,.ppt,.pptx,.txt,.wps",
        this.FileExt = obj.val().substr(obj.val().lastIndexOf(".")).toLowerCase();
    if(0 != this.AllowExt){
        if(-1 == this.AllowExt.indexOf(this.FileExt)) {
            errorTips("只支持word、pdf、ppt、txt、wps格式文件，请重新上传"), $("#loadingImg").css("visibility", "hidden")
        }else {
            $.ajaxFileUpload({
                type: "POST",
                url: action_url,
                secureuri: !1,
                fileElementId: id,
                data: {userId: userId},
                dataType: "text",
                success: function (jsonStr) {
                    var html, json = eval("(" + jsonStr + ")");
                    $("#loadingImg").css("visibility", "hidden"), json.success ? (html = '<a href="' + ctx + '/nearBy/downloadResume" class="resume_download" title="下载' + json.content.nearbyName + '">' + json.content.nearbyName + "</a>" + '<a  class="fr del" href="javascript:;">删除</a><br /><span class="c9">上传时间：' + json.content.time + "</span>", $("#myResume .resumeUploadDiv").html(html), $("#myResume h2 a").html("重新上传"), $.colorbox({
                            inline: !0,
                            href: $("div#uploadFileSuccess"),
                            title: "上传附件简历"
                        })) : -1 == json.code ? $.colorbox({
                                inline: !0,
                                href: $("div#fileResumeUpload"),
                                title: "附件简历上传失败"
                            }) : -2 == json.code ? $.colorbox({
                                    inline: !0,
                                    href: $("div#fileResumeUploadSize"),
                                    title: "附件简历上传失败"
                                }) : (errorTips("简历上传失败，请重新上传"), $("#loadingImg").css("visibility", "hidden"))
                },
                error: function () {
                    errorTips("简历上传失败，请重新上传"), $("#loadingImg").css("visibility", "hidden")
                }
            })
        }
    }
}

!function(a,b) {
    function c(a, b, c) {
        var d = k[b.type] || {};
        return null == a ? c || !b.def ? null : b.def : (a = d.floor ? ~~a : parseFloat(a), isNaN(a) ? b.def : d.mod ? (a + d.mod) % d.mod : 0 > a ? 0 : d.max < a ? d.max : a)
    }

    function d(b) {
        var c = i(),
            d = c._rgba = [];
        return b = b.toLowerCase(), o(h, function (a, e) {
            var f,
                g = e.re.exec(b),
                h = g && e.parse(g),
                i = e.space || "rgba";
            return h ? (f = c[i](h), c[j[i].cache] = f[j[i].cache], d = c._rgba = f._rgba, !1) : void 0
        }),
            d.length ? ("0,0,0,0" === d.join() && a.extend(d, n.transparent), c) : n[b]
    }

    function e(a, b, c) {
        return c = (c + 1) % 1, 1 > 6 * c ? a + 6 * (b - a) * c : 1 > 2 * c ? b : 2 > 3 * c ? a + 6 * (b - a) * (2 / 3 - c) : a
    }

    var n,
        f = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor", g = /^([\-+])=\s*(\d+\.?\d*)/, h = [{
            re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function (a) {
                return [a[1], a[2], a[3], a[4]]
            }
        }, {
            re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function (a) {
                return [2.55 * a[1], 2.55 * a[2], 2.55 * a[3], a[4]]
            }
        }, {
            re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, parse: function (a) {
                return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)]
            }
        }, {
            re: /#([a-f0-9])([a-f0-9])([a-f0-9])/, parse: function (a) {
                return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)]
            }
        }, {
            re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            space: "hsla",
            parse: function (a) {
                return [a[1], a[2] / 100, a[3] / 100, a[4]]
            }
        }], i = a.Color = function (b, c, d, e) {
            return new a.Color.fn.parse(b, c, d, e)
        }, j = {
            rgba: {props: {red: {idx: 0, type: "byte"}, green: {idx: 1, type: "byte"}, blue: {idx: 2, type: "byte"}}},
            hsla: {
                props: {
                    hue: {idx: 0, type: "degrees"},
                    saturation: {idx: 1, type: "percent"},
                    lightness: {idx: 2, type: "percent"}
                }
            }
        }, k = {
            "byte": {floor: !0, max: 255},
            percent: {max: 1},
            degrees: {mod: 360, floor: !0}
        }, l = i.support = {}, m = a("<p>")[0], o = a.each;
    m.style.cssText = "background-color:rgba(1,1,1,.5)", l.rgba = m.style.backgroundColor.indexOf("rgba") > -1, o(j, function (a, b) {
        b.cache = "_" + a, b.props.alpha = {idx: 3, type: "percent", def: 1}
    }), i.fn = a.extend(i.prototype, {
        parse: function (e, f, g, h) {
            if (e === b)return this._rgba = [null, null, null, null], this;
            (e.jquery || e.nodeType) && (e = a(e).css(f), f = b);
            var k = this, l = a.type(e), m = this._rgba = [];
            return f !== b && (e = [e, f, g, h], l = "array"), "string" === l ? this.parse(d(e) || n._default) : "array" === l ? (o(j.rgba.props, function (a, b) {
                        m[b.idx] = c(e[b.idx], b)
                    }), this) : "object" === l ? (e instanceof i ? o(j, function (a, b) {
                                e[b.cache] && (k[b.cache] = e[b.cache].slice())
                            }) : o(j, function (b, d) {
                                var f = d.cache;
                                o(d.props, function (a, b) {
                                    if (!k[f] && d.to) {
                                        if ("alpha" === a || null == e[a])return;
                                        k[f] = d.to(k._rgba)
                                    }
                                    k[f][b.idx] = c(e[a], b, !0)
                                }), k[f] && a.inArray(null, k[f].slice(0, 3)) < 0 && (k[f][3] = 1, d.from && (k._rgba = d.from(k[f])))
                            }), this) : void 0
        }, is: function (a) {
            var b = i(a), c = !0, d = this;
            return o(j, function (a, e) {
                var f, g = b[e.cache];
                return g && (f = d[e.cache] || e.to && e.to(d._rgba) || [], o(e.props, function (a, b) {
                    return null != g[b.idx] ? c = g[b.idx] === f[b.idx] : void 0
                })), c
            }), c
        }, _space: function () {
            var a = [], b = this;
            return o(j, function (c, d) {
                b[d.cache] && a.push(c)
            }), a.pop()
        }, transition: function (a, b) {
            var d = i(a), e = d._space(), f = j[e], g = 0 === this.alpha() ? i("transparent") : this, h = g[f.cache] || f.to(g._rgba), l = h.slice();
            return d = d[f.cache], o(f.props, function (a, e) {
                var f = e.idx, g = h[f], i = d[f], j = k[e.type] || {};
                null !== i && (null === g ? l[f] = i : (j.mod && (i - g > j.mod / 2 ? g += j.mod : g - i > j.mod / 2 && (g -= j.mod)), l[f] = c((i - g) * b + g, e)))
            }), this[e](l)
        }, blend: function (b) {
            if (1 === this._rgba[3])return this;
            var c = this._rgba.slice(), d = c.pop(), e = i(b)._rgba;
            return i(a.map(c, function (a, b) {
                return (1 - d) * e[b] + d * a
            }))
        }, toRgbaString: function () {
            var b = "rgba(", c = a.map(this._rgba, function (a, b) {
                return null == a ? b > 2 ? 1 : 0 : a
            });
            return 1 === c[3] && (c.pop(), b = "rgb("), b + c.join() + ")"
        }, toHslaString: function () {
            var b = "hsla(", c = a.map(this.hsla(), function (a, b) {
                return null == a && (a = b > 2 ? 1 : 0), b && 3 > b && (a = Math.round(100 * a) + "%"), a
            });
            return 1 === c[3] && (c.pop(), b = "hsl("), b + c.join() + ")"
        }, toHexString: function (b) {
            var c = this._rgba.slice(), d = c.pop();
            return b && c.push(~~(255 * d)), "#" + a.map(c, function (a) {
                return a = (a || 0).toString(16), 1 === a.length ? "0" + a : a
            }).join("")
        }, toString: function () {
            return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
        }
    }), i.fn.parse.prototype = i.fn, j.hsla.to = function (a) {
        if (null == a[0] || null == a[1] || null == a[2])return [null, null, null, a[3]];
        var k, l, b = a[0] / 255, c = a[1] / 255, d = a[2] / 255, e = a[3], f = Math.max(b, c, d), g = Math.min(b, c, d), h = f - g, i = f + g, j = .5 * i;
        return k = g === f ? 0 : b === f ? 60 * (c - d) / h + 360 : c === f ? 60 * (d - b) / h + 120 : 60 * (b - c) / h + 240, l = 0 === h ? 0 : .5 >= j ? h / i : h / (2 - i), [Math.round(k) % 360, l, j, null == e ? 1 : e]
    }, j.hsla.from = function (a) {
        if (null == a[0] || null == a[1] || null == a[2])return [null, null, null, a[3]];
        var b = a[0] / 360, c = a[1], d = a[2], f = a[3], g = .5 >= d ? d * (1 + c) : d + c - d * c, h = 2 * d - g;
        return [Math.round(255 * e(h, g, b + 1 / 3)), Math.round(255 * e(h, g, b)), Math.round(255 * e(h, g, b - 1 / 3)), f]
    }, o(j, function (d, e) {
        var f = e.props, h = e.cache, j = e.to, k = e.from;
        i.fn[d] = function (d) {
            if (j && !this[h] && (this[h] = j(this._rgba)), d === b)return this[h].slice();
            var e, g = a.type(d), l = "array" === g || "object" === g ? d : arguments, m = this[h].slice();
            return o(f, function (a, b) {
                var d = l["object" === g ? a : b.idx];
                null == d && (d = m[b.idx]), m[b.idx] = c(d, b)
            }), k ? (e = i(k(m)), e[h] = m, e) : i(m)
        }, o(f, function (b, c) {
            i.fn[b] || (i.fn[b] = function (e) {
                var k, f = a.type(e), h = "alpha" === b ? this._hsla ? "hsla" : "rgba" : d, i = this[h](), j = i[c.idx];
                return "undefined" === f ? j : ("function" === f && (e = e.call(this, j), f = a.type(e)), null == e && c.empty ? this : ("string" === f && (k = g.exec(e), k && (e = j + parseFloat(k[2]) * ("+" === k[1] ? 1 : -1))), i[c.idx] = e, this[h](i)))
            })
        })
    }), i.hook = function (b) {
        var c = b.split(" ");
        o(c, function (b, c) {
            a.cssHooks[c] = {
                set: function (b, e) {
                    var f, g, h = "";
                    if ("transparent" !== e && ("string" !== a.type(e) || (f = d(e)))) {
                        if (e = i(f || e), !l.rgba && 1 !== e._rgba[3]) {
                            for (g = "backgroundColor" === c ? b.parentNode : b; ("" === h || "transparent" === h) && g && g.style;)try {
                                h = a.css(g, "backgroundColor"), g = g.parentNode
                            } catch (j) {
                            }
                            e = e.blend(h && "transparent" !== h ? h : "_default")
                        }
                        e = e.toRgbaString()
                    }
                    try {
                        b.style[c] = e
                    } catch (j) {
                    }
                }
            }, a.fx.step[c] = function (b) {
                b.colorInit || (b.start = i(b.elem, c), b.end = i(b.end), b.colorInit = !0), a.cssHooks[c].set(b.elem, b.start.transition(b.end, b.pos))
            }
        })
    }, i.hook(f), a.cssHooks.borderColor = {
        expand: function (a) {
            var b = {};
            return o(["Top", "Right", "Bottom", "Left"], function (c, d) {
                b["border" + d + "Color"] = a
            }), b
        }
    }, n = a.Color.names = {
        aqua: "#00ffff",
        black: "#000000",
        blue: "#0000ff",
        fuchsia: "#ff00ff",
        gray: "#808080",
        green: "#008000",
        lime: "#00ff00",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        purple: "#800080",
        red: "#ff0000",
        silver: "#c0c0c0",
        teal: "#008080",
        white: "#ffffff",
        yellow: "#ffff00",
        transparent: [null, null, null, 0],
        _default: "#ffffff"
    }
}(jQuery),

    $(function() {
        function e() {
            $(".projectForm").each(function () {
                $(this).validate({
                    groups: {
                        projectStart: "projectYearStart projectMonthStart",
                        projectEnd: "projectYearEnd projectMonthEnd"
                    },
                    rules: {
                        projectName: {required: !0, maxlenStr: 100},
                        thePost: {required: !0, maxlenStr: 100},
                        projectYearStart: {required: !0, checkProjectYear: !0},
                        projectMonthStart: {required: !0, checkProjectYear: !0},
                        projectYearEnd: {required: !0, checkProjectYear: !0},
                        projectMonthEnd: {
                            required: function () {
                                return "至今" == $(".projectYearEnd").val() ? !1 : !0
                            }, checkProjectYear: !0
                        },
                        projectDescription: {required: !1}
                    },
                    messages: {
                        projectName: {required: "请输入项目名称", maxlenStr: "请输入有效的项目名称"},
                        thePost: {required: "请输入担任职务", maxlenStr: "请输入有效的担任职务"},
                        projectYearStart: {required: "请选择开始时间", checkProjectYear: "开始时间需早于结束时间"},
                        projectMonthStart: {required: "请选择开始时间", checkProjectYear: "开始时间需早于结束时间"},
                        projectYearEnd: {required: "请选择结束时间", checkProjectYear: "结束时间需晚于开始时间"},
                        projectMonthEnd: {required: "请选择结束时间", checkProjectYear: "结束时间需晚于开始时间"}
                    },
                    errorPlacement: function (a, b) {
                        "projectYearStart" == b.attr("name") || "projectMonthStart" == b.attr("name") || "projectYearEnd" == b.attr("name") || "projectMonthEnd" == b.attr("name") ? a.appendTo($(b).parent().parent()) : a.insertAfter(b)
                    },
                    submitHandler: function (a) {
                        var b = $('input[name="projectName"]', a).val(),
                            c = $('input[name="thePost"]', a).val(),
                            e = $('input[name="projectYearStart"]', a).val(),
                            f = $('input[name="projectMonthStart"]', a).val(),
                            g = $('input[name="projectYearEnd"]', a).val(),
                            h = $('input[name="projectMonthEnd"]', a).val(),
                            i = "项目描述" != $('textarea[name="projectDescription"]', a).val() ? $('textarea[name="projectDescription"]', a).val() : "",
                            j = $(".projectId", a).val();
                        $(a).find(":submit").val("保存中...").attr("disabled", !0);
                        $.ajax({
                            url: "/resume/upsertProject",
                            type: "POST",
                            data: {
                                name: b,
                                position: c,
                                yearStart: e,
                                monthStart: f,
                                yearEnd: g,
                                monthEnd: h,
                                description: i,
                                _id: j
                            },
                            dataType: "json"
                        }).done(function (res) {
                            if(!res.error){
                                $.ajax({
                                    url: "/resume/getResume",
                                    type: "POST",
                                    data: {
                                        _id: res._id
                                    },
                                    dataType: "json"
                                }).done(function (res) {
                                    var d = '';
                                    res.project.forEach(function(proj){
                                        d += '<li data-id="' + proj._id + '">', d += '<div class="projectList"><i class="sm_del dn"></i><i class="sm_edit dn"></i><div class="f16 mb10" data-proName="' + proj.name + '" data-posName="' + proj.position + '" data-startY="' + proj.yearStart + '" data-startM="' + proj.monthStart + '" data-endY="' + proj.yearEnd + '"' + 'data-endM="' + proj.monthEnd + '">' + proj.name + '，' + proj.position + '<span class="c9">（' + proj.yearStart+'.'+proj.monthStart + "-" + proj.yearEnd +'.'+ proj.monthEnd+"）</span></div>", d += '<div class="dl1">' + proj.description + "</div>", d += "</div></li>";
                                    });
                                    project.obj.children(".c_add").removeClass("dn");
                                    project.obj.children(".projectShow").children(".projectForm").hide();
                                    project.obj.children(".projectShow").children(".plist").html(d).parent().removeClass("dn");
                                    project.obj.children(".projectEdit").addClass("dn");
                                    $("#lastChangedTime span").text(res.updated);
                                    $("#resumeScore .which span").attr("rel", 'certificate');
                                });
                                scoreChange(res.completeScore);
                                k(project.obj);
                                $(a).find(":submit").val("保 存").attr("disabled", !1)
                            }else {
                                alert(b.msg);
                            }
                        });
                    }
                })
            })
        }

        function familyForm() {
            $(".familyForm").each(function () {
                $(this).validate({
                    rules: {
                        name: {required: !0, maxlenStr: 100},
                        relation: {required: !0},
                        company: {required: !0},
                        position: {required: !0, maxlenStr: 100},
                        domicile: {required: !0, maxlenStr: 100},
                    },
                    messages: {
                        name: {required: "请输入名字", maxlenStr: "请输入有效的名字"},
                        relation: {required: "请选择与本人关系"},
                        company: {required: "请输入工作单位"},
                        position: {required: "请选择职务"},
                        domicile: {required: "请选择现户籍地"}
                    },
                    submitHandler: function (a) {
                        var b = $('input[name="name"]', a).val(),
                            c = $('input[name="relation"]', a).val(),
                            e = $('input[name="company"]', a).val(),
                            f = $('input[name="position"]', a).val(),
                            g = $('input[name="domicile"]', a).val(),
                            j = $(".familyId", a).val();
                        $(a).find(":submit").val("保存中...").attr("disabled", !0);
                        $.ajax({
                            url: "/resume/upsertFamily",
                            type: "POST",
                            data: {
                                name: b,
                                relation: c,
                                company: e,
                                position: f,
                                domicile: g,
                                _id: j
                            },
                            dataType: "json"
                        }).done(function (res) {
                            if (!res.error) {
                                $.ajax({
                                    url: "/resume/getResume",
                                    type: "POST",
                                    data: {
                                        _id: res._id
                                    },
                                    dataType: "json"
                                }).done(function (res) {
                                    var d = '';
                                    res.family.forEach(function (fa) {
                                        d += '<li data-id="' + fa._id + '">', d += '<div class="familyList"><i class="sm_del dn"></i><i class="sm_edit dn"></i><div class="f16 mb10" data-name="' + fa.name + '" data-position="' + fa.position + '" data-relation="' + fa.relation + '" data-company="' + fa.company + '" data-domicile="' + fa.domicile + '">' + fa.name + '，' + fa.company + '，' + fa.position + '<span class="c9">（' + fa.relation + "）</span></div>", d += '<div class="dl1">' + fa.domicile + "</div>", d += "</div></li>";
                                    });
                                    family.obj.children(".c_add").removeClass("dn");
                                    family.obj.children(".familyShow").children(".familyForm").hide();
                                    family.obj.children(".familyShow").children(".flist").html(d).parent().removeClass("dn");
                                    family.obj.children(".familyEdit").addClass("dn");
                                    $("#lastChangedTime span").text(res.updated);
                                    $("#resumeScore .which span").attr("rel", res.next);
                                });
                                scoreChange(res.completeScore);
                                k(family.obj);
                            } else {
                                alert(b.msg);
                            }
                            $(a).find(":submit").val("保 存").attr("disabled", !1)
                        });
                    }
                })
            });
        }

        function certificateForm() {
            $(".certificateForm").each(function () {
                $(this).validate({
                    // groups: {
                    //     projectStart: "projectYearStart projectMonthStart",
                    //     projectEnd: "projectYearEnd projectMonthEnd"
                    // },
                    rules: {
                        certificateName: {required: !0},
                        certificateNature: {required: !0},
                        certificateYear: {required: !0},
                        certificateMonth: {required: !0},
                    },
                    messages: {
                        certificateName: {required: "请选择证书类型"},
                        certificateNature: {required: "请选择证书等级"},
                        certificateYear: {required: "请选择获取年份"},
                        certificateMonth: {required: "请选择获取月份"}
                    },
                    errorPlacement: function (a, b) {
                        "certificateYear" == b.attr("name") || "certificateMonth" == b.attr("name")? a.appendTo($(b).parent().parent()) : a.insertAfter(b)
                    },
                    submitHandler: function (a) {
                        var certificateName = $('input[name="certificateName"]', a).val(), certificateNature = $('input[name="certificateNature"]', a).val(), certificateYear = $('input[name="certificateYear"]', a).val(), certificateMonth = $('input[name="certificateMonth"]', a).val(), _id = $(".certificateId", a).val();
                        $(a).find(":submit").val("保存中...").attr("disabled", !0);
                        $.ajax({
                            url: "/resume/upsertCertificate",
                            type: "POST",
                            data: {
                                name: certificateName,
                                nature: certificateNature,
                                gotYear: certificateYear,
                                gotMonth: certificateMonth,
                                _id: _id
                            },
                            dataType: "json"
                        }).done(function (res) {
                            if(!res.error) {
                                $.ajax({
                                    url: "/resume/getResume",
                                    type: "POST",
                                    data: {
                                        _id: $('#_id').val()
                                    },
                                    dataType: "json"
                                }).done(function (res) {
                                    for(cert = res.certificate, d = "", e = 0; e < cert.length; e++){
                                        if(0 == e % 2){
                                            d += '<li data-id="' + cert[e]._id + '" class="clear">';
                                        }else {
                                            d += '<li data-id="' + cert[e]._id + '">'
                                        }
                                        d += '<i class="sm_del dn"></i><i class="sm_edit dn"></i><span class="c9" data-gotYear="' + cert[e].gotYear + '" data-gotMonth="' + cert[e].gotMonth + '">' + cert[e].gotYear + "." + cert[e].gotMonth + "</span>" + "<div>" + '<h3 data-name="' + cert[e].name + '">' + cert[e].name + "</h3>" + '<h4 data-nature="' + cert[e].nature + '">' + cert[e].nature + "</h4>" + "</div>" + "</li>";
                                    }
                                    certificate.obj.children(".c_add").removeClass("dn");
                                    certificate.obj.children(".certificateShow").children(".certificateForm").hide();
                                    certificate.obj.children(".certificateShow").children(".clist").html(d).parent().removeClass("dn");
                                    certificate.obj.children(".certificateEdit").addClass("dn");
                                    $("#lastChangedTime span").text(res.updated);
                                });
                                scoreChange(res.completeScore);
                                k(certificate.obj);
                                $(a).find(":submit").val("保 存").attr("disabled", !1)
                            }else{
                                alert(res.error);
                            }
                        })
                    }
                })
            })
        }

        function i() {
            $(".workForm").each(function () {
                $(this).validate({
                    rules: {
                        workLink: {required: !1, checkUrlNot: !0, maxlength: 150},
                        workDescription: {required: !1, maxlength: 100}
                    },
                    messages: {
                        workLink: {checkUrlNot: "请输入有效的作品链接", maxlength: "请输入有效的作品链接"},
                        workDescription: {maxlength: "请输入100字以内的有效作品说明"}
                    },
                    submitHandler: function (a) {
                        var b = "请输入作品链接" != $('input[name="workLink"]', a).val() ? $('input[name="workLink"]', a).val() : "", c = "请输入说明文字" != $('textarea[name="workDescription"]', a).val() ? $('textarea[name="workDescription"]', a).val() : "", d = $(".showId", a).val(), e = $("#resumeId").val(), f = $("#resubmitToken").val();
                        $(a).find(":submit").val("保存中...").attr("disabled", !0), $.ajax({
                            url: ctx + "/workShow/save.json",
                            type: "POST",
                            data: {url: b, workName: c, wsid: d, id: e, resubmitToken: f},
                            dataType: "json"
                        }).done(function (b) {
                            var c, d, e;
                            $("#resubmitToken").val(b.resubmitToken), b.success ? (c = "", d = "", e = b.content.workShow, 3 == b.code ? "" != e ? (c += '<li data-id="' + e.id + '"><div class="workList c7">' + '<i class="sm_del dn"></i>' + '<i class="sm_edit dn"></i>', e.url && (d = "http://" == e.url.substring(0, 7) || "https://" == e.url.substring(0, 8) ? e.url : "http://" + e.url, c += '<div class="f16">网址：<a href="' + d + '" target="_blank">' + e.url + "</a></div>"), c += "<p>" + e.workName + "</p>" + "</div></li>", placeholderFn(), "" != $.trim(h.obj.children(".workShow").children(".slist").html()) && $(a).remove(), h.obj.children(".workShow").children(".slist").prepend(c), h.obj.children(".workShow").removeClass("dn"), h.obj.children(".workEdit").addClass("dn"), h.obj.children(".c_add").removeClass("dn")) : "" != $.trim(h.obj.children(".workShow").children(".slist").html()) ? ($(a).remove(), h.obj.children(".c_add").removeClass("dn")) : (h.obj.children(".workEdit").addClass("dn"), h.obj.children(".workAdd").removeClass("dn")) : 4 == b.code ? (c += '<div class="workList c7"><i class="sm_del dn"></i><i class="sm_edit dn"></i>', e.url && (d = "http://" == e.url.substring(0, 7) || "https://" == e.url.substring(0, 8) ? e.url : "http://" + e.url, c += '<div class="f16">网址：<a href="' + d + '" target="_blank">' + e.url + "</a></div>"), c += "<p>" + e.workName + "</p>" + "</div>", placeholderFn(), $(a).parent("li").html(c)) : 2 == b.code && ($(a).parent("li").remove(), "" == $.trim(h.obj.children(".workShow").children(".slist").html()) && h.AddCancel), h.obj.find(".slist li:last-child").addClass("noborder"), $("#lastChangedTime span").text(b.content.refreshTime), $("#resumeScore .which div").text(b.content.infoCompleteStatus.msg), $("#resumeScore .which span").attr("rel", b.content.infoCompleteStatus.nextStage), scoreChange(b.content.infoCompleteStatus.score), k(h.obj), b.content.isNew && changeAllIds(b.content.jsonIds)) : alert(b.msg), $(a).find(":submit").val("保 存").attr("disabled", !1)
                        })
                    }
                })
            })
        }

        function j() {
            a = !1
        }

        function k() {
            a = !0
        }

        var b, work, d, f, g, h, a, family, education, certificate = !0;

        $(".profile_radio li input").click(function () {
            $(this).parent("li").siblings("li").removeClass("current"), $(this).parent("li").addClass("current")
        });
        $(".education_radio li input").click(function () {
            $(this).parent("li").siblings("li").removeClass("current"), $(this).parent("li").addClass("current")
        });
        $(document).click(function () {
            $(".boxUpDown").hide().prev("input").removeClass("select_focus")
        }), $("#resumeScore .which span").bind("click", function () {
            var a = $(this).attr("rel");
            "complete" != a && click_scroll(a)
        }), jQuery.validator.addMethod("checkWorkYear", function (a, b) {
            var c = $(b).parents(".experienceForm"), d = c.find(".companyYearStart").val(), e = c.find(".companyMonthStart").val(), f = c.find(".companyYearEnd").val(), g = c.find(".companyMonthEnd").val();
            return d > f ? !1 : d == f && e > g ? !1 : !0
        }, "开始时间需早于结束时间"), jQuery.validator.addMethod("checkProjectYear", function (a, b) {
            var c = $(b).parents(".projectForm"), d = c.find(".projectYearStart").val(), e = c.find(".projectMonthStart").val(), f = c.find(".projectYearEnd").val(), g = c.find(".projectMonthEnd").val();
            return d > f ? !1 : d == f && e > g ? !1 : !0
        }, "开始时间需早于结束时间"), jQuery.validator.addMethod("checkSchoolYear", function (a, b) {
            var c = $(b).parents(".educationalForm"), d = c.find(".schoolYearStart").val(), e = c.find(".schoolYearEnd").val();
            return d > e ? !1 : !0
        }, "开始时间需小于结束时间");

        $("#resume_name .nameShow .rename").bind("click", function () {
            $(this).parent().addClass("dn"), $(this).parent().siblings("form").removeClass("dn"), j($("#resume_name"))
        });
        $("#resumeNameForm .cancel").bind('click', function(){
            $(this).parent().addClass("dn"), $(this).parent().siblings(".nameShow").removeClass("dn"), j($("#resume_name"))
        });
        $("#resumeNameForm").validate({
            rules: {resumeName: {required: !0, checkNum: !0, maxlenStr: 100}},
            messages: {resumeName: {required: "请输入简历名称", checkNum: "请输入有效的简历名称", maxlenStr: "请输入100字以内的简历名称"}},
            errorPlacement: function (a, b) {
                a.appendTo($(b).parent())
            },
            submitHandler: function (a) {
                var resumename = $('input[name="resumeName"]', a).val(),
                    _id = $("#_id").val();
                $(a).find(":submit").attr("disabled", !0);
                $.ajax({
                    url: "/resume/upsertResume",
                    type: "POST",
                    data: {
                        resumename: resumename,
                        _id: _id
                    }
                }).done(function (res) {
                    if (!res.error) {
                        var resume = res,
                            resumename = resume.resumename.length > 18? resume.resumename.substring(0, 15) + "...":resume.resumename;
                        $("#resume_name .nameShow h1").attr("title", resume.resumename).text(resumename).parent().removeClass("dn");
                        $("#resume_name form").addClass("dn");
                        $("#lastChangedTime span").text(resume.updated);
                        k($("#resume_name"));
                    } else alert(res.error);
                    $(a).find(":submit").attr("disabled", !1)
                })
            }
        }),
        $("#basicInfo .c_edit").bind("click", function () {
            var name = $("#nameVal").val(),
                nation = $("#nationVal").val(),
                gender = $("#genderVal").val(),
                birthed = $("#birthedVal").val(),
                experience = $("#experienceVal").val(),
                status = $("#statusVal").val(),
                myemail = $("#emailVal").val(),
                tel = $("#telVal").val(),
                origin = $("#originVal").val(),
                domicile = $("#domicileVal").val(),
                politic = $("#politicVal").val(),
                idCard = $("#idCardVal").val(),
                address = $("#addressVal").val(),
                height = $("#heightVal").val(),
                weight = $("#weightVal").val(),
                married = $("#marriedVal").val(),
                health = $("#healthVal").val(),
                child = $("#childVal").val(),
                workunit = $("#workunitVal").val(),
                post = $("#postVal").val(),
                honor = $("#honorVal").val();
                $("#name").val(name),
                "" != nation && ($("#nation").val(nation).css("color", "#333")),
                $('#basicInfo .profile_radio li input[value="' + gender + '"]').attr("checked", !0).parent("li").addClass("current").siblings("li").removeClass("current"),
                $("#birthed").val(birthed);
                if("" != experience) {
                    if(-1 !== experience.indexOf('工作经验')) experience = experience.substr(0, experience.indexOf('工作经验'));
                    $("#experience").val(experience).css("color", "#333");
                };
            "" != status && ($("#status").val(status).css("color", "#333")),
                $('input[name="email"]').val(myemail),
                $("#tel").val(tel),
                $("#origin").val(origin).css("color", "#333"),
                $("#domicile").val(domicile).css("color", "#333"),
            "" != politic && ($("#politic").val(politic).css("color", "#333")),
                $("#idCard").val(idCard),
                $("#address").val(address),
                $("#height").val(height),
                $("#weight").val(weight),
            "" != married && ($("#married").val(married).css("color", "#333")),
                $("#health").val(health),
            "" != child && ($("#child").val(child).css("color", "#333")),
                $("#workunit").val(workunit),
                $("#post").val(post).css("color", "#333"),
                $("#honor").val(honor),
                $("#portraitShow img").attr("src", $("#basicInfo .basicShow img").attr("src")),
                $("#portraitNo").hide(),
                $("#portraitShow").show(),
                $(this).addClass("dn"),
                $("#basicInfo .basicShow").addClass("dn"),
                $("#basicInfo .basicEdit").removeClass("dn"),
                j($("#basicInfo"))
        }),
            $("#nation").bind("click", function (a) {
                a.stopPropagation(),
                    $(this).addClass("select_focus"),
                    $("#experience").removeClass("select_focus"),
                    $("#status").removeClass("select_focus"),
                    $("#nation").removeClass("select_focus"),
                    $("#politic").removeClass("select_focus"),
                    $("#married").removeClass("select_focus"),
                    $("#child").removeClass("select_focus"),
                    $("#box_nation").show(),
                    $("#box_experience").hide(),
                    $("#box_status").hide(),
                    $("#box_politic").hide(),
                    $("#box_married").hide(),
                    $("#box_child").hide()
            }),
            $("#box_nation").on("click", "ul li", function (a) {
                a.stopPropagation();
                var b = $(this).text();
                $("#nation").val(b).css("color", "#333").removeClass("select_focus"),
                    $("#nation").val(b),
                    $("#box_nation").hide(),
                    $("#profileForm").validate().element($("#nation"))
            }),
            $("#experience").bind("click", function (a) {
                a.stopPropagation(),
                    $(this).addClass("select_focus"),
                    $("#status").removeClass("select_focus"),
                    $("#nation").removeClass("select_focus"),
                    $("#politic").removeClass("select_focus"),
                    $("#married").removeClass("select_focus"),
                    $("#child").removeClass("select_focus"),
                    $("#box_experience").show(),
                    $("#box_status").hide(),
                    $("#box_nation").hide(),
                    $("#box_politic").hide(),
                    $("#box_married").hide(),
                    $("#box_child").hide()
            }),
            $("#box_experience").on("click", "ul li", function (a) {
                a.stopPropagation();
                var b = $(this).text();
                $("#experience").val(b).css("color", "#333").removeClass("select_focus"),
                    $("#experience").val(b),
                    $("#box_experience").hide(),
                    $("#profileForm").validate().element($("#experience"))
            }),
            $("#status").bind("click", function (a) {
                a.stopPropagation(),
                    $(this).addClass("select_focus"),
                    $("#nation").removeClass("select_focus"),
                    $("#experience").removeClass("select_focus"),
                    $("#politic").removeClass("select_focus"),
                    $("#married").removeClass("select_focus"),
                    $("#child").removeClass("select_focus"),
                    $("#box_nation").hide(),
                    $("#box_experience").hide(),
                    $("#box_politic").hide(),
                    $("#box_married").hide(),
                    $("#box_child").hide(),
                    $("#box_status").show()
            }),
            $("#box_status").on("click", "ul li", function (a) {
                a.stopPropagation();
                var b = $(this).text();
                $("#status").val(b).css("color", "#333").removeClass("select_focus"),
                    $("#status").val(b),
                    $("#box_status").hide(),
                    $("#profileForm").validate().element($("#status"))
            }),
            $("#politic").bind("click", function (a) {
                a.stopPropagation(),
                    $(this).addClass("select_focus"),
                    $("#nation").removeClass("select_focus"),
                    $("#experience").removeClass("select_focus"),
                    $("#status").removeClass("select_focus"),
                    $("#married").removeClass("select_focus"),
                    $("#child").removeClass("select_focus"),
                    $("#box_nation").hide(),
                    $("#box_experience").hide(),
                    $("#box_status").hide(),
                    $("#box_married").hide(),
                    $("#box_child").hide(),
                    $("#box_politic").show()
            }),
            $("#box_politic").on("click", "ul li", function (a) {
                a.stopPropagation();
                var b = $(this).text();
                $("#politic").val(b).css("color", "#333").removeClass("select_focus"),
                    $("#politic").val(b),
                    $("#box_politic").hide(),
                    $("#profileForm").validate().element($("#politic"))
            }),
            $("#married").bind("click", function (a) {
                a.stopPropagation(),
                    $(this).addClass("select_focus"),
                    $("#nation").removeClass("select_focus"),
                    $("#experience").removeClass("select_focus"),
                    $("#status").removeClass("select_focus"),
                    $("#politic").removeClass("select_focus"),
                    $("#child").removeClass("select_focus"),
                    $("#box_nation").hide(),
                    $("#box_experience").hide(),
                    $("#box_status").hide(),
                    $("#box_politic").hide(),
                    $("#box_child").hide(),
                    $("#box_married").show()
            }),
            $("#box_married").on("click", "ul li", function (a) {
                a.stopPropagation();
                var b = $(this).text();
                $("#married").val(b).css("color", "#333").removeClass("select_focus"),
                    $("#married").val(b),
                    $("#box_married").hide(),
                    $("#profileForm").validate().element($("#married"))
            }),
            $("#child").bind("click", function (a) {
                a.stopPropagation(),
                    $(this).addClass("select_focus"),
                    $("#nation").removeClass("select_focus"),
                    $("#experience").removeClass("select_focus"),
                    $("#status").removeClass("select_focus"),
                    $("#politic").removeClass("select_focus"),
                    $("#married").removeClass("select_focus"),
                    $("#box_nation").hide(),
                    $("#box_experience").hide(),
                    $("#box_status").hide(),
                    $("#box_politic").hide(),
                    $("#box_married").hide(),
                    $("#box_child").show()
            }),
            $("#box_child").on("click", "ul li", function (a) {
                a.stopPropagation();
                var b = $(this).text();
                $("#child").val(b).css("color", "#333").removeClass("select_focus"),
                    $("#child").val(b),
                    $("#box_child").hide(),
                    $("#profileForm").validate().element($("#child"))
            }),
            $("#profileForm").validate({
                rules: {
                    name: {
                        required: !0,
                        specialchar: !0,
                        checkNum: !0,
                        rangelength: [2, 20]
                    },
                    nation: {required: !0},
                    gender: {required: !1},
                    birthed: {required: !0},
                    experience: {required: !0},
                    status: {required: !1},
                    email: {required: !0, email: !0, maxlength: 80},
                    tel: {required: !0, isMobile: !0, maxlength: 30},
                    origin: {required: !0},
                    domicile: {required: !0},
                    politic: {required: !0},
                    idCard: {required: !0,number:true},
                    address: {required: !0},
                    height: {required: !1,number:true},
                    weight: {required: !1,number:true},
                },
                messages: {
                    name: {
                        required: "请输入你的真实姓名",
                        specialchar: "请输入你的真实姓名",
                        checkNum: "请输入你的真实姓名",
                        rangelength: "请输入你的真实姓名"
                    },
                    nation: {required: "请选择民族"},
                    birthed: {required: "请输入你的出生日期"},
                    experience: {required: "请选择工作年限"},
                    email: {
                        required: "请输入接收面试通知的常用邮箱",
                        email: "请输入有效的常用邮箱",
                        maxlength: "请输入有效的常用邮箱"
                    },
                    tel: {required: "请输入手机号码", isMobile: "请输入有效的手机号码", maxlength: "请输入有效的手机号码"},
                    origin: {required: "请选择你的籍贯"},
                    domicile: {required: "请选择你的现户籍地"},
                    politic: {required: "请选择你的政治面貌"},
                    idCard: {required: "请输入你的身份证号码",number: "请输入有效的号码"},
                    address: {required: "请输入你的通讯地址"},
                    height: {number: "请输入有效的数字"},
                    weight: {number: "请输入有效的数字"},
                },
                errorPlacement: function (a, b) {
                    "hidden" == b.attr("type") ? a.appendTo($(b).parent()) : "radio" == b.attr("type") ? a.insertAfter($(b).parents("ul")) : a.insertAfter(b)
                },
                submitHandler: function (a) {
                    var _id = $('input[name="_id"]', a).val(),
                        name = $('input[name="name"]', a).val(),
                        nation = $('input[name="nation"]', a).val()==='民族'?'':$('input[name="nation"]', a).val(),
                        gender = $('input[name="gender"]:checked', a).val(),
                        birthed = $('input[name="birthed"]', a).val(),
                        experience = $('input[name="experience"]', a).val()==='工作经验'?'':$('input[name="experience"]', a).val(),
                        status = $('input[name="status"]', a).val()==='目前状态'?'':$('input[name="status"]', a).val(),
                        email = $('input[name="email"]', a).val(),
                        tel = $('input[name="tel"]', a).val(),
                        origin = $('input[name="origin"]', a).val(),
                        domicile = $('input[name="domicile"]', a).val(),
                        politic = $('input[name="politic"]', a).val()==='政治面貌'?'':$('input[name="politic"]', a).val(),
                        idCard = $('input[name="idCard"]', a).val(),
                        address = $('input[name="address"]', a).val(),
                        height = $('input[name="height"]', a).val(),
                        weight = $('input[name="weight"]', a).val(),
                        married = $('input[name="married"]', a).val()==='婚姻状况'?'':$('input[name="married"]', a).val(),
                        health = $('input[name="health"]', a).val(),
                        child = $('input[name="child"]', a).val()==='子女状况'?'':$('input[name="child"]', a).val(),
                        workunit = $('input[name="workunit"]', a).val(),
                        post = $('input[name="post"]', a).val(),
                        honor = $('input[name="honor"]', a).val();
                    $(a).find(":submit").val("保存中...").attr("disabled", !0);
                    $.ajax({
                        url: "resume/upsertResume",
                        type: "POST",
                        data: {
                            _id: _id,
                            name: name,
                            nation: nation,
                            gender: gender,
                            birthed: birthed,
                            experience: experience,
                            status: status,
                            email: email,
                            phone: tel,
                            origin: origin,
                            domicile:domicile,
                            politic:politic,
                            idCard:idCard,
                            address:address,
                            height:height,
                            weight:weight,
                            married:married,
                            health:health,
                            child:child,
                            workunit:workunit,
                            post:post,
                            honor:honor
                        },
                        dataType: "json"
                    }).done(function (res) {
                        if(!res.error) {
                            var e;
                            if("应届毕业生" != res.experience){
                                res.experience += "工作经验";
                                $("#workExperience h2 span").text("（投递简历时必填）");
                            }else{
                                $("#workExperience h2 span").text("")
                            }
                            e = res.name;
                            if(res.gender && "" != res.gender) e += " | " + res.gender;
                            e += " | " + res.nation + " | " + getOperationTime(res.birthed) + "<br />" + '籍贯'+res.origin + ' | ' + res.experience + ' | '+ res. domicile + ' | '+ res.politic+ "<br />" + res.phone + " | " + res.idCard+' | '+res.email+'<br />'+res.address+ "<br />";
                            if(res.workunit && "" != res.workunit) e += res.workunit;
                            if(res.post && "" != res.post) e += " | " + res.post;
                            if(res.status && "" != res.status) e += " | " + res.status+ '<br />';
                            if(res.height && "" != res.height) e += "身高" + res.height;
                            if(res.weight && "" != res.weight) e += " | 体重" + res.weight+ '<br />';
                            if(res.married && "" != res.married) e += res.married;
                            if(res.child && "" != res.child) e += " | " + res.child;
                            if(res.health && "" != res.health) e += " | 身体状况 " + res.health;
                            if(res.honor && "" != res.honor) e += " | " + res.honor;
                            $("#basicInfo .basicShow span").html(e).parent().removeClass("dn");
                            $("#basicInfo .basicEdit").addClass("dn");
                            $("#basicInfo .c_edit").removeClass("dn");
                            $("#_id").val(res._id);
                            $("#nameVal").val(res.name);
                            $("#nationVal").val(res.nation);
                            $("#genderVal").val(res.gender);
                            $("#birthedVal").val(getOperationTime(res.birthed));
                            $("#experienceVal").val(res.experience);
                            $("#statusVal").val(res.status);
                            $("#emailVal").val(res.email);
                            $("#telVal").val(res.phone);
                            $("#originVal").val(res.origin);
                            $("#domicileVal").val(res.domicile);
                            $("#politicVal").val(res.politic);
                            $("#idCardVal").val(res.idCard);
                            $("#addressVal").val(res.address);
                            $("#heightVal").val(res.height);
                            $("#weightVal").val(res.weight);
                            $("#marriedVal").val(res.married);
                            $("#healthVal").val(res.health);
                            $("#childVal").val(res.child);
                            $("#workunitVal").val(res.workunit);
                            $("#postVal").val(res.post);
                            $("#honorVal").val(res.honor);
                            $("#lastChangedTime span").text(res.updated);
                            scoreChange(res.completeScore);
                            k($("#basicInfo"));
                        }else{
                            alert(res.error);
                        }
                        $(a).find(":submit").val("保 存").attr("disabled", !1);
                    });
                }
            });

            $("#profileForm .btn_profile_cancel").bind("click", function () {
            $(this).parents(".basicEdit").addClass("dn").siblings(".basicShow").removeClass("dn"), $("#basicInfo .c_edit").removeClass("dn"), k($("#basicInfo"))
        }), $("#select_expectCity").bind("click", function (a) {
            a.stopPropagation(), $(this).addClass("select_focus"), $("#select_expectSalary").removeClass("select_focus"), $("#box_expectCity").show(), $("#box_expectSalary").hide()
        }), $("#box_expectCity").on("click", "dl dd span", function (a) {
            a.stopPropagation();
            var b = $(this).text();
            $("#select_expectCity").val(b).css("color", "#333").removeClass("select_focus"), $("#expectCity").val(b), $("#box_expectCity").hide(), $("#expectForm").validate().element($("#expectCity"))
        }), $("#select_expectSalary").bind("click", function (a) {
            a.stopPropagation(), $(this).addClass("select_focus"), $("#select_expectCity").removeClass("select_focus"), $("#box_expectSalary").show(), $("#box_expectCity").hide()
        }), $("#box_expectSalary").on("click", "ul li", function (a) {
            a.stopPropagation();
            var b = $(this).text();
            $("#select_expectSalary").val(b).css("color", "#333").removeClass("select_focus"), $("#expectSalary").val(b), $("#box_expectSalary").hide(), $("#profileForm").validate().element($("#expectSalary"))
        }), b = {
            obj: $("#expectJob"),
            expectJobVal: $("#expectJobVal").val(),
            expectCityVal: $("#expectCityVal").val(),
            typeVal: $("#typeVal").val(),
            expectPositionVal: $("#expectPositionVal").val(),
            expectSalaryVal: $("#expectSalaryVal").val(),
            Add: function () {
                this.obj.find(".expectAdd").addClass("dn"), this.obj.find(".expectShow").addClass("dn"), this.obj.find(".c_edit").addClass("dn"), this.obj.find(".expectEdit").removeClass("dn"), j(this.obj)
            },
            Edit: function () {
                "" == this.expectCityVal ? ($("#expectCity").val(""), $("#select_expectCity").val("期望城市，如：北京").css("color", "#999")) : ($("#expectCity").val(this.expectCityVal), $("#select_expectCity").val(this.expectCityVal).css("color", "#333")), "" != this.typeVal ? $('#expectJob .profile_radio li input[value="' + this.typeVal + '"]').attr("checked", !0).parent("li").addClass("current").siblings("li").removeClass("current") : $("#expectJob .profile_radio li input").attr("checked", !1).parent("li").removeClass("current"), $("#expectPosition").val(this.expectPositionVal), "" == this.expectSalaryVal ? ($("#expectSalary").val(""), $("#select_expectSalary").val("期望月薪").css("color", "#999")) : ($("#expectSalary").val(this.expectSalaryVal), $("#select_expectSalary").val(this.expectSalaryVal).css("color", "#333")), placeholderFn(), this.obj.find(".expectAdd").addClass("dn"), this.obj.find(".expectShow").addClass("dn"), this.obj.find(".c_edit").addClass("dn"), this.obj.find(".expectEdit").removeClass("dn"), j(this.obj)
            },
            Cancel: function () {
                this.expectCityVal || this.typeVal || this.expectPositionVal || this.expectSalaryVal ? this.obj.find(".expectEdit").addClass("dn").siblings(".expectShow").removeClass("dn").siblings(".c_edit").removeClass("dn").siblings(".expectAdd").addClass("dn") : this.obj.find(".expectEdit").addClass("dn").siblings(".expectShow").addClass("dn").siblings(".c_edit").addClass("dn").siblings(".expectAdd").removeClass("dn"), k(this.obj)
            }
        }, b.obj.find(".expectAdd").bind("click", function () {
            b.Add()
        }), b.obj.find(".c_edit").bind("click", function () {
            b.Edit()
        }), $("#expectForm .btn_profile_cancel").bind("click", function () {
            b.Cancel()
        }), $("#expectPosition").bind("keyup", function () {
            var a = $.trim($(this).val());
            "" != a && suggestPosition(a, "#expectPosition")
        }), $("#expectForm").validate({
            rules: {
                expectCity: {required: !1},
                type: {required: !1},
                expectPosition: {required: !1, specialchar: !0, checkNum: !0, minlength: 2, maxlength: 100},
                expectSalary: {required: !1}
            },
            messages: {
                expectPosition: {
                    specialchar: "请输入有效的期望职位",
                    checkNum: "请输入有效的期望职位",
                    minlength: "请输入有效的期望职位",
                    maxlength: "请输入有效的期望职位"
                }
            },
            errorPlacement: function (a, b) {
                "hidden" == b.attr("type") ? a.appendTo($(b).parent()) : "radio" == b.attr("type") ? a.insertAfter($(b).parents("ul")) : a.insertAfter(b)
            },
            submitHandler: function (a) {
                var c = $('input[name="expectCity"]', a).val(), d = $('input[name="type"]:checked', a).val(), e = "期望职位" != $('input[name="expectPosition"]', a).val() ? $('input[name="expectPosition"]', a).val() : "", f = $('input[name="expectSalary"]', a).val(), g = $("#resumeId").val(), h = $("#resubmitToken").val();
                $(a).find(":submit").val("保存中...").attr("disabled", !0), $.ajax({
                    url: ctx + "/resume/expect.json",
                    type: "POST",
                    data: {city: c, positionType: d, positionName: e, salarys: f, id: g, resubmitToken: h},
                    dataType: "json"
                }).done(function (g) {
                    if ($("#resubmitToken").val(g.resubmitToken), g.success) {
                        if (c || d || e || f) {
                            var h = g.content.expectJob;
                            b.obj.find(".expectShow").children("span").html(h).parent().removeClass("dn"), b.obj.find(".c_edit").removeClass("dn"), b.obj.find(".expectEdit").addClass("dn"), b.obj.find("#expectJobVal").val(g.content.resume.expectJob), b.obj.find("#expectCityVal").val(g.content.resume.city), b.obj.find("#typeVal").val(g.content.resume.positionType), b.obj.find("#expectPositionVal").val(g.content.resume.positionName), b.obj.find("#expectSalaryVal").val(g.content.resume.salarys), b.expectJobVal = g.content.resume.expectJob, b.expectCityVal = g.content.resume.city, b.typeVal = g.content.resume.positionType, b.expectPositionVal = g.content.resume.positionName, b.expectSalaryVal = g.content.resume.salarys, $("#lastChangedTime span").text(g.content.refreshTime), $("#resumeScore .which div").text(g.content.infoCompleteStatus.msg), $("#resumeScore .which span").attr("rel", g.content.infoCompleteStatus.nextStage), scoreChange(g.content.infoCompleteStatus.score), k(b.obj)
                        } else b.obj.find(".expectShow").addClass("dn"), b.obj.find(".expectEdit").addClass("dn"), b.obj.find(".c_edit").addClass("dn"), b.obj.find(".expectAdd").removeClass("dn"), k(b.obj);
                        g.content.isNew && changeAllIds(g.content.jsonIds)
                    } else alert(g.msg);
                    $(a).find(":submit").val("保 存").attr("disabled", !1)
                })
            }
        }), $(".select_companyYearStart").bind("click", function (a) {
            a.stopPropagation(), openYear("companyYearStart")
        }), $(".box_companyYearStart").on("click", "ul li", function (a) {
            var b, c;
            a.stopPropagation(), b = $(this).text(), selectYear("companyYearStart", b), c = $(this).parents(".experienceForm"), $(this).parents(".box_companyYearStart").siblings(".companyYearStart").hasClass("error") && $(this).parents(".experienceForm").validate().element(c.find(".companyYearStart")), c.find(".companyYearEnd").hasClass("error") ? $(this).parents(".experienceForm").validate().element(c.find(".companyYearEnd")) : c.find(".companyMonthEnd").hasClass("error") && $(this).parents(".experienceForm").validate().element(c.find(".companyMonthEnd"))
        }), $(".select_companyMonthStart").bind("click", function (a) {
            a.stopPropagation(), openYear("companyMonthStart")
        }), $(".box_companyMonthStart").on("click", "ul li", function (a) {
            var b, c;
            a.stopPropagation(), b = $(this).text(), selectYear("companyMonthStart", b), c = $(this).parents(".experienceForm"), $(this).parents(".box_companyMonthStart").siblings(".companyMonthStart").hasClass("error") && $(this).parents(".experienceForm").validate().element(c.find(".companyMonthStart")), c.find(".companyYearEnd").hasClass("error") ? $(this).parents(".experienceForm").validate().element(c.find(".companyYearEnd")) : c.find(".companyMonthEnd").hasClass("error") && $(this).parents(".experienceForm").validate().element(c.find(".companyMonthEnd"))
        }), $(".select_companyYearEnd").bind("click", function (a) {
            a.stopPropagation(), openYear("companyYearEnd")
        }), $(".box_companyYearEnd").on("click", "ul li", function (a) {
            var b, c, d;
            a.stopPropagation(), b = $(this).text(), c = $(this).parents(".experienceForm").find(".companyMonthEnd").val(), selectYear("companyYearEnd", b), d = $(this).parents(".experienceForm"), "至今" == $.trim(b) ? (d.find(".companyMonthEnd").val("至今"), d.find(".select_companyMonthEnd").css("color", "#333").val("至今"), d.find(".select_companyMonthEnd").unbind("click")) : ("至今" == $.trim(c) && (d.find(".companyMonthEnd").val(""), d.find(".select_companyMonthEnd").css("color", "#999").val("结束时间")), d.find(".select_companyMonthEnd").bind("click", function (a) {
                    a.stopPropagation(), openYear("companyMonthEnd")
                })), $(this).parents(".box_companyYearEnd").siblings(".companyYearEnd").hasClass("error") && $(this).parents(".experienceForm").validate().element(d.find(".companyYearEnd")), d.find(".companyYearStart").hasClass("error") ? $(this).parents(".experienceForm").validate().element(d.find(".companyYearStart")) : d.find(".companyMonthStart").hasClass("error") && $(this).parents(".experienceForm").validate().element(d.find(".companyMonthStart"))
        }), $(".select_companyMonthEnd").bind("click", function (a) {
            a.stopPropagation(), openYear("companyMonthEnd")
        }), $(".box_companyMonthEnd").on("click", "ul li", function (a) {
            var b, c;
            a.stopPropagation(), b = $(this).text(), selectYear("companyMonthEnd", b), c = $(this).parents(".experienceForm"), $(this).parents(".box_companyMonthEnd").siblings(".companyMonthEnd").hasClass("error") && $(this).parents(".experienceForm").validate().element(c.find(".companyMonthEnd")), c.find(".companyYearStart").hasClass("error") ? $(this).parents(".experienceForm").validate().element(c.find(".companyYearStart")) : c.find(".companyMonthStart").hasClass("error") && $(this).parents(".experienceForm").validate().element(c.find(".companyMonthStart"))
        });

        work = {
            obj: $("#workExperience"),
            companyNameVal: "",
            positionNameVal: "",
            companyYearStartVal: "",
            companyMonthStartVal: "",
            companyYearEndVal: "",
            companyMonthEndVal: "",
            Add: function () {
                this.obj.children(".experienceEdit").find(".companyName").val(""), this.obj.children(".experienceEdit").find(".positionName").val(""), this.obj.children(".experienceEdit").find(".companyYearStart").val(""), this.obj.children(".experienceEdit").find(".select_companyYearStart").css("color", "#999").val("开始年份"), this.obj.children(".experienceEdit").find(".companyMonthStart").val(""), this.obj.children(".experienceEdit").find(".select_companyMonthStart").css("color", "#999").val("开始月份"), this.obj.children(".experienceEdit").find(".companyYearEnd").val(""), this.obj.children(".experienceEdit").find(".select_companyYearEnd").css("color", "#999").val("结束年份"), this.obj.children(".experienceEdit").find(".companyMonthEnd").val(""), this.obj.children(".experienceEdit").find(".select_companyMonthEnd").css("color", "#999").val("结束月份"), placeholderFn(), this.obj.children(".experienceAdd").addClass("dn"), this.obj.children(".experienceShow").addClass("dn"), this.obj.children(".experienceEdit").removeClass("dn"), j(this.obj)
            },
            AddMore: function () {
                this.obj.children(".experienceShow").find(".companyName").val(""), this.obj.children(".experienceShow").find(".positionName").val(""), this.obj.children(".experienceShow").find(".companyYearStart").val(""), this.obj.children(".experienceShow").find(".select_companyYearStart").css("color", "#999").val("开始年份"), this.obj.children(".experienceShow").find(".companyMonthStart").val(""), this.obj.children(".experienceShow").find(".select_companyMonthStart").css("color", "#999").val("开始月份"), this.obj.children(".experienceShow").find(".companyYearEnd").val(""), this.obj.children(".experienceShow").find(".select_companyYearEnd").css("color", "#999").val("结束年份"), this.obj.children(".experienceShow").find(".companyMonthEnd").val(""), this.obj.children(".experienceShow").find(".select_companyMonthEnd").css("color", "#999").val("结束月份"), this.obj.children(".experienceShow").find(".expId").val(""), placeholderFn(), this.obj.children(".experienceShow").children(".experienceForm").show(), j(this.obj)
            },
            Edit: function (a) {
                var b = a.parent("li").attr("data-id"),
                    c = a.siblings("span").attr("data-startYear"),
                    d = a.siblings("span").attr("data-endYear"),
                    e = a.siblings("span").attr("data-startMonth"),
                    f = a.siblings("span").attr("data-endMonth"),
                    h = a.parent("li").find("h3").text().trim(),
                    i = a.parent("li").find("h4").text().trim();
                this.obj.children(".experienceShow").find(".companyName").val(h),
                    this.obj.children(".experienceShow").find(".positionName").val(i),
                    this.obj.children(".experienceShow").find(".companyYearStart").val(c),
                    this.obj.children(".experienceShow").find(".select_companyYearStart").css("color", "#333").val(c),
                    this.obj.children(".experienceShow").find(".companyMonthStart").val(e),
                    this.obj.children(".experienceShow").find(".select_companyMonthStart").css("color", "#333").val(e),
                    this.obj.children(".experienceShow").find(".companyYearEnd").val(d),
                    this.obj.children(".experienceShow").find(".select_companyYearEnd").css("color", "#333").val(d),
                    this.obj.children(".experienceShow").find(".companyMonthEnd").val(f),
                    this.obj.children(".experienceShow").find(".select_companyMonthEnd").css("color", "#333").val(f),
                    this.obj.children(".experienceShow").find(".expId").val(b),
                    this.obj.children(".experienceShow").children(".experienceForm").show(),
                "至今" == $.trim(f) && this.obj.children(".experienceShow").find(".select_companyMonthEnd").unbind("click"),
                    this.companyNameVal = i, this.positionNameVal = h, this.companyYearStartVal = c, this.companyMonthStartVal = e, this.companyYearEndVal = d, this.companyMonthEndVal = f, this.obj.children(".c_add").addClass("dn"), j(this.obj)
            },
            Del: function (a) {
                var b = a.parent("li").attr("data-id");
                $.ajax({
                    url: "/resume/deleteWork",
                    type: "POST",
                    data: {id: b}
                }).done(
                    function (res) {
                        if(res.error) alert(res.error);
                        else{
                            a.parent("li").remove();
                            if("" == res.work || null == res.work) {
                                work.obj.children(".experienceShow").addClass("dn");
                                work.obj.children(".experienceEdit").addClass("dn");
                                work.obj.children(".experienceAdd").removeClass("dn");
                                work.obj.children(".c_add").addClass("dn");
                            }
                            else{
                                work.obj.children(".experienceShow").children(".experienceForm").hide()
                            }
                            $("#lastChangedTime span").text(res.updated);
                            scoreChange(res.completeScore);
                            k($("#basicInfo"));
                        }
                    });
            },
            AddCancel: function () {
                this.obj.find(".experienceAdd").removeClass("dn"), this.obj.find(".experienceShow").addClass("dn"), this.obj.find(".experienceEdit").addClass("dn"), k(this.obj)
            },
            AddMoreCancel: function () {
                this.obj.children(".experienceShow").children(".experienceForm").hide(), k(this.obj)
            }
        }, work.obj.find(".experienceAdd").bind("click", function () {
            work.Add()
        }), work.obj.find(".c_add").bind("click", function () {
            work.AddMore(), $(this).addClass("dn")
        }), work.obj.on("click", ".sm_edit", function () {
            work.Edit($(this))
        }), work.obj.on("click", ".sm_del", function () {
            confirm("确认要删除吗？") && work.Del($(this))
        }), work.obj.children(".experienceShow").on({
            mouseenter: function () {
                $(this).children(".wlist").find(".sm_del,.sm_edit").removeClass("dn")
            }, mouseleave: function () {
                $(this).children(".wlist").find(".sm_del,.sm_edit").addClass("dn")
            }
        }), work.obj.children(".experienceEdit").find(".btn_profile_cancel").bind("click", function () {
            work.AddCancel()
        }), work.obj.children(".experienceShow").find(".btn_profile_cancel").bind("click", function () {
            work.AddMoreCancel(), work.obj.find(".c_add").removeClass("dn")
        });

        $(".experienceForm").each(function () {
            $(this).validate({
                groups: {
                    companyStart: "companyYearStart companyMonthStart",
                    companyEnd: "companyYearEnd companyMonthEnd"
                },
                rules: {
                    companyName: {required: !0, maxlenStr: 100},
                    positionName: {required: !0, checkNum: !0, maxlenStr: 100},
                    companyYearStart: {required: !0, checkWorkYear: !0},
                    companyMonthStart: {required: !0, checkWorkYear: !0},
                    companyYearEnd: {required: !0, checkWorkYear: !0},
                    companyMonthEnd: {
                        required: function () {
                            return "至今" == $(".companyYearEnd").val() ? !1 : !0
                        }, checkWorkYear: !0
                    }
                },
                messages: {
                    companyName: {required: "请输入有效的公司名称", maxlenStr: "请输入有效的公司名称"},
                    positionName: {
                        required: "请输入有效的职位名称",
                        checkNum: "请输入有效的职位名称",
                        maxlenStr: "请输入有效的职位名称"
                    },
                    companyYearStart: {required: "请选择开始时间", checkWorkYear: "开始时间需早于结束时间"},
                    companyMonthStart: {required: "请选择开始时间", checkWorkYear: "开始时间需早于结束时间"},
                    companyYearEnd: {required: "请选择结束时间", checkWorkYear: "结束时间需晚于开始时间"},
                    companyMonthEnd: {required: "请选择结束时间", checkWorkYear: "结束时间需晚于开始时间"}
                },
                errorPlacement: function (a, b) {
                    "companyYearStart" == b.attr("name") || "companyMonthStart" == b.attr("name") || "companyYearEnd" == b.attr("name") || "companyMonthEnd" == b.attr("name") ? a.appendTo($(b).parent().parent()) : a.insertAfter(b)
                },
                submitHandler: function (a) {
                    var b = $('input[name="companyName"]', a).val(),
                        d = $('input[name="positionName"]', a).val(),
                        e = $('input[name="companyYearStart"]', a).val(),
                        f = $('input[name="companyMonthStart"]', a).val(),
                        g = $('input[name="companyYearEnd"]', a).val(),
                        h = $('input[name="companyMonthEnd"]', a).val(),
                        i = $(".expId", a).val()
                    $(a).find(":submit").val("保存中...").attr("disabled", !0);
                    $.ajax({
                        url: "/resume/upsertWork",
                        type: "POST",
                        data: {
                            company: b,
                            position: d,
                            yearStart: e,
                            monthStart: f,
                            yearEnd: g,
                            monthEnd: h,
                            _id: i
                        },
                        dataType: "json"
                    }).done(function (res) {
                        if(!res.error) {
                            $.ajax({
                                url: "/resume/getResume",
                                type: "POST",
                                data: {
                                    _id: res._id
                                },
                                dataType: "json"
                            }).done(function (res) {
                                for(wo = res.work, d = "", e = 0; e < wo.length; e++){
                                    if(0 == e % 2){
                                        d += '<li data-id="' + wo[e]._id + '" class="clear">';
                                    }else {
                                        d += '<li data-id="' + wo[e]._id + '">'
                                    }
                                    d += '<i class="sm_del dn"></i><i class="sm_edit dn"></i><span class="c9" data-startYear="' + wo[e].yearStart + '" data-endYear="' + wo[e].yearEnd + '" data-startMonth = "' + wo[e].monthStart + '" data-endMonth = "' + wo[e].monthEnd + '">' + wo[e].yearStart+'.'+wo[e].monthStart + "-" + wo[e].yearEnd+'.'+wo[e].monthEnd + "</span>" + "<h3>" + wo[e].company + "</h3>" + "<h4>" + wo[e].position + "</h4>" + "</div>" + "</li>";
                                }
                                work.obj.children(".c_add").removeClass("dn");
                                work.obj.children(".experienceShow").children(".experienceForm").hide();
                                work.obj.children(".experienceShow").children(".wlist").html(d).parent().removeClass("dn");
                                work.obj.children(".experienceEdit").addClass("dn");
                                $("#lastChangedTime span").text(res.updated);
                                $("#resumeScore .which span").attr("rel", 'projectExperience');
                            })
                            scoreChange(res.completeScore);
                            k(work.obj);
                            $(a).find(":submit").val("保 存").attr("disabled", !1)
                        }else{
                            alert(res.error);
                        }
                    })
                }
            })
        });

        $("#projectExperience").on("click", ".select_projectYearStart", function (a) {
            a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings(".box_projectYearStart").show()
        }), $("#projectExperience").on("click", ".box_projectYearStart li", function (a) {
            var b, c;
            a.stopPropagation(), b = $(this).text(), $(this).parents(".box_projectYearStart").siblings(".select_projectYearStart").val(b).css("color", "#333").removeClass("select_focus"), $(this).parents(".box_projectYearStart").siblings(".projectYearStart").val(b), $(this).parents(".box_projectYearStart").hide(), c = $(this).parents(".projectForm"), $(this).parents(".box_projectYearStart").siblings(".projectYearStart").hasClass("error") && $(this).parents(".projectForm").validate().element(c.find(".projectYearStart")), c.find(".projectYearEnd").hasClass("error") ? $(this).parents(".projectForm").validate().element(c.find(".projectYearEnd")) : c.find(".projectMonthEnd").hasClass("error") && $(this).parents(".projectForm").validate().element(c.find(".projectMonthEnd"))
        }), $("#projectExperience").on("click", ".select_projectMonthStart", function (a) {
            a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings(".box_projectMonthStart").show()
        }), $("#projectExperience").on("click", ".box_projectMonthStart li", function (a) {
            var b, c;
            a.stopPropagation(), b = $(this).text(), $(this).parents(".box_projectMonthStart").siblings(".select_projectMonthStart").val(b).css("color", "#333").removeClass("select_focus"), $(this).parents(".box_projectMonthStart").siblings(".projectMonthStart").val(b), $(this).parents(".box_projectMonthStart").hide(), c = $(this).parents(".projectForm"), $(this).parents(".box_projectMonthStart").siblings(".projectMonthStart").hasClass("error") && $(this).parents(".projectForm").validate().element(c.find(".projectMonthStart")), c.find(".projectYearEnd").hasClass("error") ? $(this).parents(".projectForm").validate().element(c.find(".projectYearEnd")) : c.find(".projectMonthEnd").hasClass("error") && $(this).parents(".projectForm").validate().element(c.find(".projectMonthEnd"))
        }), $("#projectExperience").on("click", ".select_projectYearEnd", function (a) {
            a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings(".box_projectYearEnd").show()
        }), $("#projectExperience").on("click", ".box_projectYearEnd li", function (a) {
            var b, c, d;
            a.stopPropagation(), b = $(this).text(), c = $(this).parents(".projectForm").find(".projectMonthEnd").val(), $(this).parents(".box_projectYearEnd").siblings(".select_projectYearEnd").val(b).css("color", "#333").removeClass("select_focus"), $(this).parents(".box_projectYearEnd").siblings(".projectYearEnd").val(b), $(this).parents(".box_projectYearEnd").hide(), d = $(this).parents(".projectForm"), "至今" == $.trim(b) ? (d.find(".projectMonthEnd").val("至今"), d.find(".select_projectMonthEnd").css("color", "#333").val("至今"), $("#projectExperience").off("click", ".select_projectMonthEnd")) : ("至今" == $.trim(c) && (d.find(".projectMonthEnd").val(""), d.find(".select_projectMonthEnd").css("color", "#999").val("结束时间")), $("#projectExperience").on("click", ".select_projectMonthEnd", function (a) {
                    a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings(".box_projectMonthEnd").show()
                })), $(this).parents(".box_projectYearEnd").siblings(".projectYearEnd").hasClass("error") && $(this).parents(".projectForm").validate().element(d.find(".projectYearEnd")), d.find(".projectYearStart").hasClass("error") ? $(this).parents(".projectForm").validate().element(d.find(".projectYearStart")) : d.find(".projectMonthStart").hasClass("error") && $(this).parents(".projectForm").validate().element(d.find(".projectMonthStart"))
        }), $("#projectExperience").on("click", ".select_projectMonthEnd", function (a) {
            a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings(".box_projectMonthEnd").show()
        }), $("#projectExperience").on("click", ".box_projectMonthEnd li", function (a) {
            var b, c;
            a.stopPropagation(), b = $(this).text(), $(this).parents(".box_projectMonthEnd").siblings(".select_projectMonthEnd").val(b).css("color", "#333").removeClass("select_focus"), $(this).parents(".box_projectMonthEnd").siblings(".projectMonthEnd").val(b), $(this).parents(".box_projectMonthEnd").hide(), c = $(this).parents(".projectForm"), $(this).parents(".box_projectMonthEnd").siblings(".projectMonthEnd").hasClass("error") && $(this).parents(".projectForm").validate().element(c.find(".projectMonthEnd")), c.find(".projectYearStart").hasClass("error") ? $(this).parents(".projectForm").validate().element(c.find(".projectYearStart")) : c.find(".projectMonthStart").hasClass("error") && $(this).parents(".projectForm").validate().element(c.find(".projectMonthStart"))
        });

        project = {
            obj: $("#projectExperience"),
            resetForm: function () {
                this.obj.children(".projectEdit").find(".projectName").val(""), this.obj.children(".projectEdit").find(".thePost").val(""), this.obj.children(".projectEdit").find(".projectYearStart").val(""), this.obj.children(".projectEdit").find(".select_projectYearStart").css("color", "#999").val("开始年份"), this.obj.children(".projectEdit").find(".projectMonthStart").val(""), this.obj.children(".projectEdit").find(".select_projectMonthStart").css("color", "#999").val("开始月份"), this.obj.children(".projectEdit").find(".projectYearEnd").val(""), this.obj.children(".projectEdit").find(".select_projectYearEnd").css("color", "#999").val("结束年份"), this.obj.children(".projectEdit").find(".projectMonthEnd").val(""), this.obj.children(".projectEdit").find(".select_projectMonthEnd").css("color", "#999").val("结束月份"), this.obj.children(".projectEdit").find(".projectDescription").val(""), this.obj.children(".projectEdit").find(".word_count").children("span").text(500), this.obj.children(".projectEdit").find(".projectId").val("")
            }, Add: function () {
                this.resetForm(), placeholderFn(), this.obj.children(".projectAdd").addClass("dn"), this.obj.children(".projectShow").addClass("dn"), this.obj.children(".projectEdit").removeClass("dn"), j(this.obj)
            }, AddMore: function () {
                this.resetForm(), placeholderFn(), this.obj.children(".projectShow").prepend(this.obj.children(".projectEdit").children("form").clone()), this.obj.children(".projectShow").children("form").css("borderBottom", "1px solid #e5e5e5").show(), this.obj.children(".projectEdit").addClass("dn"), e(), j(this.obj)
            }, Edit: function (a) {
                var m, b = a.parents("li"), c = b.attr("data-id"), d = b.find("div.f16").attr("data-proName"), f = b.find("div.f16").attr("data-posName"), g = b.find("div.f16").attr("data-startY"), h = b.find("div.f16").attr("data-startM"), i = b.find("div.f16").attr("data-endY"), k = b.find("div.f16").attr("data-endM"), l = b.find(".dl1").html();
                l && (l = $.trim(l.replace(/<br>/gi, ""))), this.resetForm(), m = this.obj.children(".projectEdit").children("form").clone(), m.find(".projectName").val(d), m.find(".thePost").val(f), "" != g && (m.find(".projectYearStart").val(g), m.find(".select_projectYearStart").css("color", "#333").val(g)), "" != h && (m.find(".projectMonthStart").val(h), m.find(".select_projectMonthStart").css("color", "#333").val(h)), "" != i && (m.find(".projectYearEnd").val(i), m.find(".select_projectYearEnd").css("color", "#333").val(i)), "" != k && (m.find(".projectMonthEnd").val(k), m.find(".select_projectMonthEnd").css("color", "#333").val(k)), "至今" == $.trim(k) && m.find(".select_projectMonthEnd").unbind("click"), m.find(".projectDescription").val(l), m.find(".word_count").children("span").text(500 - m.find(".projectDescription").val().length), m.find(".projectId").val(c), a.parents("li").prepend(m), placeholderFn(), a.parents("li").children(".projectList").addClass("dn"), e(), j(this.obj)
            }, Del: function (a) {
                var b = a.parents("li").attr("data-id");
                $.ajax({
                    url: "/resume/deleteProject",
                    type: "POST",
                    data: {id: b}
                }).done(function (res) {
                        if(res.error) alert(res.error);
                        else{
                            a.parents("li").remove();
                            $("ul.plist li:last-child").addClass("noborder");
                            if("" == res.project || null == res.project) {
                                project.obj.children(".projectShow").addClass("dn");
                                project.obj.children(".projectEdit").addClass("dn");
                                project.obj.children(".projectAdd").removeClass("dn");
                                project.obj.children(".c_add").addClass("dn");
                            }
                            else{
                                project.obj.children(".projectShow").children(".projectForm").hide()
                            }
                            $("#lastChangedTime span").text(res.updated);
                            scoreChange(res.completeScore);
                            k($("#basicInfo"));
                        }
                })
            }, AddCancel: function () {
                this.obj.find(".projectAdd").removeClass("dn"), this.obj.find(".projectShow").addClass("dn"), this.obj.find(".projectEdit").addClass("dn"), k(this.obj)
            }, AddMoreCancel: function (a) {
                a.parents(".projectForm").siblings(".projectList").removeClass("dn"), a.parents(".projectForm").remove(), k(this.obj)
            }
        };
        project.obj.find(".plist li:last-child").addClass("noborder");
        project.obj.find(".projectAdd").bind("click", function () {
            project.Add()
        });
        project.obj.find(".c_add").bind("click", function () {
            project.AddMore(), $(this).addClass("dn")
        });
        project.obj.on("click", ".sm_edit", function () {
            project.Edit($(this))
        });
        project.obj.on("click", ".sm_del", function () {
            confirm("确认要删除吗？") && project.Del($(this))
        });
        project.obj.children(".projectShow").on({
            mouseenter: function () {
                $(this).children(".plist").find(".sm_del,.sm_edit").removeClass("dn")
            }, mouseleave: function () {
                $(this).children(".plist").find(".sm_del,.sm_edit").addClass("dn")
            }
        });
        project.obj.on("keyup", ".s_textarea", function () {
            var a = $(this);
            $.trim(a.val()).length > 500 ? a.val($.trim(a.val()).substring(0, 500)) : a.next(".word_count").children("span").text(500 - $.trim(a.val()).length)
        });
        project.obj.children(".projectEdit").find(".btn_profile_cancel").bind("click", function () {
            project.AddCancel()
        });
        project.obj.children(".projectShow").on("click", ".btn_profile_cancel", function () {
            project.AddMoreCancel($(this)), project.obj.find(".c_add").removeClass("dn")
        });
            e();

        $(".select_schoolYearStart").bind("click", function (a) {
            a.stopPropagation(), openYear("schoolYearStart")
        }), $(".box_schoolYearStart").on("click", "ul li", function (a) {
            a.stopPropagation();
            var b = $(this).text();
            selectYear("schoolYearStart", b), $(this).parents(".educationalForm").validate().element($(".schoolYearStart"))
        }), $(".select_schoolYearEnd").bind("click", function (a) {
            a.stopPropagation(), openYear("schoolYearEnd")
        }), $(".box_schoolYearEnd").on("click", "ul li", function (a) {
            a.stopPropagation();
            var b = $(this).text();
            selectYear("schoolYearEnd", b), $(this).parents(".educationalForm").validate().element($(".schoolYearEnd"))
        }), $(".select_degree").bind("click", function (a) {
            a.stopPropagation(), $(this).addClass("select_focus"), $(".select_schoolYearStart").removeClass("select_focus"), $(".select_schoolYearEnd").removeClass("select_focus"), $(".box_schoolYearStart").hide(), $(".box_schoolYearEnd").hide(), $(".box_degree").show()
        }), $(".box_degree").on("click", "ul li", function (a) {
            a.stopPropagation();
            var b = $(this).text();
            $(".select_degree").val(b).css("color", "#333").removeClass("select_focus"), $(".degree").val(b), $(".box_degree").hide(), $(this).parents(".educationalForm").validate().element($(".degree"))
        });

        $("#certificate").on("click", ".certificateYear", function (a) {
            a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings(".box_certificateYear").show()
        }),
        $("#certificate").on("click", ".box_certificateYear li", function (a) {
            var b, c;
            a.stopPropagation(), b = $(this).text(), $(this).parents(".box_certificateYear").siblings(".certificateYear").val(b).css("color", "#333").removeClass("select_focus"), $(this).parents(".box_certificateYear").siblings(".certificateYear").val(b), $(this).parents(".box_certificateYear").hide(), c = $(this).parents(".certificateForm"), $(this).parents(".box_certificateYear").siblings(".certificateYear").hasClass("error") && $(this).parents(".certificateForm").validate().element(c.find(".certificateYear"));
        }),
        $("#certificate").on("click", ".certificateMonth", function (a) {
            a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings(".box_certificateMonth").show()
        }),
        $("#certificate").on("click", ".box_certificateMonth li", function (a) {
            var b, c;
            a.stopPropagation(), b = $(this).text(), $(this).parents(".box_certificateMonth").siblings(".certificateMonth").val(b).css("color", "#333").removeClass("select_focus"), $(this).parents(".box_certificateMonth").siblings(".certificateMonth").val(b), $(this).parents(".box_certificateMonth").hide(), c = $(this).parents(".certificateForm"), $(this).parents(".box_certificateMonth").siblings(".certificateMonth").hasClass("error") && $(this).parents(".certificateForm").validate().element(c.find(".certificateMonth"));
        });
        function certificate_child(id){
            var output='';
            $(".box_certificateNature").show();
            for(var i in ce_a){
                if(i.substr(0,2)==id && i.substr(2)!='00') output+='<li value="'+ i +'">'+ ce_a[i] +'</li>';
            }
            output = '<ul>' + output + '</ul>'
            return output;
        }
        $("#certificate").on("click", ".certificateName", function (a) {
            a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings(".box_certificateName").show()
        })
        $("#certificate").on("click", ".box_certificateName li", function (a) {
            a.stopPropagation();
            b = $(this).text();
            $(this).parents(".box_certificateName").siblings(".certificateName").val(b).css("color", "#333").removeClass("select_focus");
            $(this).parents(".box_certificateName").siblings(".certificateName").val(b);
            $(this).parents(".box_certificateName").hide();
            c = $(this).parents(".certificateForm");
            $(this).parents(".box_certificateName").siblings(".certificateName").hasClass("error") && $(this).parents(".certificateForm").validate().element(c.find(".certificateName"));
            $(".box_certificateNature").html(certificate_child(this.value));
        })
        $("#certificate").on("click", ".certificateNature", function (a) {
            a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings(".box_certificateNature").show()
        });
        $("#certificate").on("click", ".box_certificateNature li", function (a) {
            a.stopPropagation();
            b = $(this).text();
            $(this).parents(".box_certificateNature").siblings(".certificateNature").val(b).css("color", "#333").removeClass("select_focus");
            $(this).parents(".box_certificateNature").siblings(".certificateNature").val(b);
            $(this).parents(".box_certificateNature").hide();
            c = $(this).parents(".certificateForm");
            $(this).parents(".box_certificateNature").siblings(".certificateNature").hasClass("error") && $(this).parents(".certificateForm").validate().element(c.find(".certificateNature"));
        })
        certificate = {
            obj: $("#certificate"),
            resetForm: function () {
                this.obj.children(".certificateEdit").find(".certificateName").val(""), this.obj.children(".certificateEdit").find(".certificateNature").val(""), this.obj.children(".certificateEdit").find(".certificateYear").val(""), this.obj.children(".certificateEdit").find(".certificateYear").css("color", "#999").val("获取年份"), this.obj.children(".certificateEdit").find(".certificateMonth").val(""), this.obj.children(".certificateEdit").find(".certificateMonth").css("color", "#999").val("获取月份"), this.obj.children(".certificateEdit").find(".certificateId").val("")
            },
            Add: function () {
                this.resetForm(), placeholderFn(), this.obj.children(".certificateAdd").addClass("dn"), this.obj.children(".certificateShow").addClass("dn"), this.obj.children(".certificateEdit").removeClass("dn"), j(this.obj)
            },
            AddMore: function () {
                this.obj.children(".certificateShow").find(".certificateName").val(""), this.obj.children(".certificateShow").find(".certificateNature").val(""), this.obj.children(".certificateShow").find(".certificateYear").val(""), this.obj.children(".certificateShow").find(".certificateMonth").val(""), this.obj.children(".certificateShow").find(".certificateId").val(""), placeholderFn(), this.obj.children(".certificateShow").children(".certificateForm").show(), j(this.obj)
            },
            Edit: function (a) {
                var b = a.parent("li").attr("data-id"),
                    c = a.siblings("span").attr("data-gotYear"),
                    d = a.siblings("span").attr("data-gotMonth"),
                    e = a.parent("li").find("h4").attr("data-nature"),
                    g = a.parent("li").find("h3").attr("data-name");
                this.obj.children(".certificateShow").find(".certificateName").css("color", "#333").val(g),
                    this.obj.children(".certificateShow").find(".certificateNature").css("color", "#333").val(e),
                    this.obj.children(".certificateShow").find(".certificateYear").css("color", "#333").val(c),
                    this.obj.children(".certificateShow").find(".certificateMonth").css("color", "#333").val(d),
                    this.obj.children(".certificateShow").find(".certificateId").val(b),
                    $(".certificateForm").validate().element($(".certificateYear")),
                    this.obj.children(".certificateShow").children(".certificateForm").show(),
                    // this.schoolNameVal = g,
                    // this.degreeVal = e,
                    // this.professionalNameVal = f,
                    // this.schoolYearStartVal = c,
                    // this.schoolYearEndVal = d,
                    this.obj.children(".c_add").addClass("dn"),
                    j(this.obj);
            }, Del: function (a) {
                var b = a.parent("li").attr("data-id");
                $.ajax(
                    {
                        url: "/resume/deleteCertificate",
                        type: "POST",
                        data: {id: b}
                    }).done(
                        function (res) {
                            if(res.error) alert(res.error);
                            else{
                                a.parent("li").remove();
                                if("" == res.certificate || null == res.certificate) {
                                    certificate.obj.children(".certificateShow").addClass("dn");
                                    certificate.obj.children(".certificateEdit").addClass("dn");
                                    certificate.obj.children(".certificateAdd").removeClass("dn");
                                    certificate.obj.children(".c_add").addClass("dn");
                                }
                                else{
                                    certificate.obj.children(".certificateShow").children(".certificateForm").hide()
                                }
                                $("#lastChangedTime span").text(res.updated);
                                scoreChange(res.completeScore);
                                k($("#basicInfo"));
                            }
                        })
            }, AddCancel: function () {
                this.obj.find(".certificateAdd").removeClass("dn"), this.obj.find(".certificateShow").addClass("dn"), this.obj.find(".certificateEdit").addClass("dn"), k(this.obj)
            }, AddMoreCancel: function (a) {
                this.obj.children(".certificateShow").children(".certificateForm").hide(), k(this.obj);
            }
        },
            certificate.obj.find(".clist li:last-child").addClass("noborder"),
            certificate.obj.find(".certificateAdd").bind("click", function () {
                certificate.Add()
            }),
            certificate.obj.find(".c_add").bind("click", function () {
                certificate.AddMore(), $(this).addClass("dn")
            }),
            certificate.obj.on("click", ".sm_edit", function () {
                certificate.Edit($(this))
            }),
            certificate.obj.on("click", ".sm_del", function () {
                confirm("确认要删除吗？") && certificate.Del($(this))
            }),
            certificate.obj.children(".certificateShow").on({
                mouseenter: function () {
                    $(this).children(".clist").find(".sm_del,.sm_edit").removeClass("dn")
                }, mouseleave: function () {
                    $(this).children(".clist").find(".sm_del,.sm_edit").addClass("dn")
                }
            }),
            certificate.obj.on("keyup", ".s_textarea", function () {
            var a = $(this);
            $.trim(a.val()).length > 500 ? a.val($.trim(a.val()).substring(0, 500)) : a.next(".word_count").children("span").text(500 - $.trim(a.val()).length)
        }), certificate.obj.children(".certificateEdit").find(".btn_profile_cancel").bind("click", function () {
            certificate.AddCancel()
        }), certificate.obj.children(".certificateShow").on("click", ".btn_profile_cancel", function () {
            certificate.AddMoreCancel($(this)), certificate.obj.find(".c_add").removeClass("dn")
        }),
            certificateForm();

        education = {
            obj: $("#educationalBackground"),
            schoolNameVal: "",
            degreeVal: "",
            professionalNameVal: "",
            schoolYearStartVal: "",
            schoolYearEndVal: "",
            Add: function () {
                this.obj.children(".educationalEdit").find(".schoolName").val(""), this.obj.children(".educationalEdit").find(".degree").val(""), this.obj.children(".educationalEdit").find(".select_degree").css("color", "#999").val("学历"), this.obj.children(".educationalEdit").find(".professionalName").val(""), this.obj.children(".educationalEdit").find(".schoolYearStart").val(""), this.obj.children(".educationalEdit").find(".select_schoolYearStart").css("color", "#999").val("开始年份"), this.obj.children(".educationalEdit").find(".schoolYearEnd").val(""), this.obj.children(".educationalEdit").find(".select_schoolYearEnd").css("color", "#999").val("结束年份"), placeholderFn(), this.obj.children(".educationalAdd").addClass("dn"), this.obj.children(".educationalShow").addClass("dn"), this.obj.children(".educationalEdit").removeClass("dn"), j(this.obj)
            },
            AddMore: function () {
                this.obj.children(".educationalShow").find(".schoolName").val(""), this.obj.children(".educationalShow").find(".degree").val(""), this.obj.children(".educationalShow").find(".select_degree").css("color", "#999").val("学历"), this.obj.children(".educationalShow").find(".professionalName").val(""), this.obj.children(".educationalShow").find(".schoolYearStart").val(""), this.obj.children(".educationalShow").find(".select_schoolYearStart").css("color", "#999").val("开始年份"), this.obj.children(".educationalShow").find(".schoolYearEnd").val(""), this.obj.children(".educationalShow").find(".select_schoolYearEnd").css("color", "#999").val("结束年份"), this.obj.children(".educationalShow").find(".eduId").val(""), placeholderFn(), this.obj.children(".educationalShow").children(".educationalForm").show(), j(this.obj)
            },
            Edit: function (a) {
                var eduId = a.parent("li").attr("data-id"),
                    began = a.siblings("span").attr("data-startY"),
                    ended = a.siblings("span").attr("data-endY"),
                    degree = a.parent("li").find("h4").attr("data-degree"),
                    profession = a.parent("li").find("h4").attr("data-profession"),
                    school = a.parent("li").find("h3").attr("data-name");
                this.obj.children(".educationalShow").find(".schoolName").val(school);
                this.obj.children(".educationalShow").find(".degree").val(degree);
                this.obj.children(".educationalShow").find(".select_degree").css("color", "#333").val(degree);
                this.obj.children(".educationalShow").find(".professionalName").val(profession);
                this.obj.children(".educationalShow").find(".schoolYearStart").val(began);
                this.obj.children(".educationalShow").find(".select_schoolYearStart").css("color", "#333").val(began);
                this.obj.children(".educationalShow").find(".schoolYearEnd").val(ended);
                this.obj.children(".educationalShow").find(".select_schoolYearEnd").css("color", "#333").val(ended);
                this.obj.children(".educationalShow").find(".eduId").val(eduId);
                $(".educationalForm").validate().element($(".schoolYearStart"));
                this.obj.children(".educationalShow").children(".educationalForm").show();
                this.schoolNameVal = school;
                this.degreeVal = degree;
                this.professionalNameVal = profession;
                this.schoolYearStartVal = began;
                this.schoolYearEndVal = ended;
                this.obj.children(".c_add").addClass("dn");
                j(this.obj)
            },
            Del: function (a) {
                var b = a.parent("li").attr("data-id");
                $.ajax(
                    {
                        url: "/resume/deleteEducation",
                        type: "POST",
                        data: {id: b}
                    }).done(
                    function (res) {
                        if(res.error) alert(res.error);
                        else{
                            a.parent("li").remove();
                            if("" == res.education || null == res.education) {
                                education.obj.children(".educationalShow").addClass("dn");
                                education.obj.children(".educationalEdit").addClass("dn");
                                education.obj.children(".educationalAdd").removeClass("dn");
                                education.obj.children(".c_add").addClass("dn");
                            }
                            else{
                                education.obj.children(".educationalShow").children(".educationalForm").hide()
                            }
                            $("#lastChangedTime span").text(res.updated);
                            scoreChange(res.completeScore);
                            k($("#basicInfo"));
                        }
                    });
            },
            AddCancel: function () {
                this.obj.find(".educationalAdd").removeClass("dn"), this.obj.find(".educationalShow").addClass("dn"), this.obj.find(".educationalEdit").addClass("dn"), k(this.obj)
            },
            AddMoreCancel: function () {
                this.obj.children(".educationalShow").children(".educationalForm").hide(), k(this.obj)
            }
        };
        education.obj.find(".educationalAdd").bind("click", function () {
            education.Add()
        });
        education.obj.find(".c_add").bind("click", function () {
            education.AddMore(), $(this).addClass("dn")
        });
        education.obj.on("click", ".sm_edit", function () {
            education.Edit($(this))
        });
        education.obj.on("click", ".sm_del", function () {
            confirm("确认要删除吗？") && education.Del($(this))
        });
        education.obj.children(".educationalShow").on({
            mouseenter: function () {
                $(this).children(".elist").find(".sm_del,.sm_edit").removeClass("dn")
            }, mouseleave: function () {
                $(this).children(".elist").find(".sm_del,.sm_edit").addClass("dn")
            }
        });
        education.obj.children(".educationalEdit").find(".btn_profile_cancel").bind("click", function () {
            education.AddCancel()
        });
        education.obj.children(".educationalShow").find(".btn_profile_cancel").bind("click", function () {
            education.AddMoreCancel(), education.obj.find(".c_add").removeClass("dn")
        });
        $('#educationalBackground').on("click", ".schoolName", function () {
            var inst = $('[data-remodal-id=choose-box-wrapper]').remodal();
            inst.open();
            initProvince();
            $('[province-id="1"]').addClass('choosen');
            initSchool(1);
        });
        function hide() {
            $('#choose-box-wrapper').css("display","none");
        }
        function initProvince() {
            $('#choose-a-province').html('');
            for(i=0;i<schoolList.length;i++) {
                $('#choose-a-province').append('<a class="province-item" province-id="'+schoolList[i].id+'">'+schoolList[i].name+'</a>');
            }
            $('.province-item').bind('click', function(){
                    var item=$(this);
                    var province = item.attr('province-id');
                    var choosenItem = item.parent().find('.choosen');
                    if(choosenItem)
                        $(choosenItem).removeClass('choosen');
                    item.addClass('choosen');
                    initSchool(province);
                }
            );
        }
        function initSchool(provinceID) {
            $('#choose-a-school').html('');
            var schools = schoolList[provinceID-1].school;
            for(i=0;i<schools.length;i++) {
                $('#choose-a-school').append('<a class="school-item" school-id="'+schools[i].id+'">'+schools[i].name+'</a>');
            }
            $('.school-item').bind('click', function(){
                    var item=$(this);
                    var school = item.attr('school-id');
                    $('.schoolName').val(item.text());
                    var inst = $('[data-remodal-id=choose-box-wrapper]').remodal();
                    inst.close();
                }
            );
        }

        $(".educationalForm").each(function () {
            $(this).validate({
                groups: {schoolYear: "schoolYearStart schoolYearEnd"},
                rules: {
                    schoolName: {required: !0, checkNum: !0, maxlenStr: 100},
                    degree: {required: !0},
                    professionalName: {required: !0, checkNum: !0, maxlenStr: 100},
                    schoolYearStart: {required: !0, checkSchoolYear: !0},
                    schoolYearEnd: {required: !0, checkSchoolYear: !0},
                    nature: {required: !0},
                },
                messages: {
                    schoolName: {required: "请选择学校"},
                    degree: {required: "请选择学历"},
                    professionalName: {required: "请选择专业"},
                    schoolYearStart: {required: "请选择年份", checkSchoolYear: "开始年份需小于结束年份"},
                    schoolYearEnd: {required: "请选择年份", checkSchoolYear: "结束年份不能早于开始年份"},
                    nature: {required: "请选择学历性质"}
                },
                errorPlacement: function (a, b) {
                    "hidden" == b.attr("type") ? "schoolYearStart" == b.attr("name") || "schoolYearEnd" == b.attr("name") ? a.appendTo($(b).parent().parent()) : a.appendTo($(b).parent()) : a.insertAfter(b)
                },
                submitHandler: function (a) {
                    var b = $('input[name="schoolName"]', a).val(),
                        c = $('input[name="degree"]', a).val(),
                        d = $('input[name="professionalName"]', a).val(),
                        e = $('input[name="schoolYearStart"]', a).val(),
                        g = $('input[name="schoolYearEnd"]', a).val(),
                        nature = $('input[name="nature"]:checked', a).val(),
                        h = $(".eduId", a).val(),
                        i = $("#_id").val(),
                        j = $("#resubmitToken").val();
                    $(a).find(":submit").val("保存中...").attr("disabled", !0);
                    $.ajax({
                        url: "/resume/upsertEducation",
                        type: "POST",
                        data: {
                            school: b,
                            degree: c,
                            profession: d,
                            began: e,
                            ended: g,
                            nature:nature,
                            _id: h,
                            id: i,
                            resubmitToken: j
                        },
                        dataType: "json"
                    }).done(function (res) {
                        if(!res.error) {
                            $.ajax({
                                url: "/resume/getResume",
                                type: "POST",
                                data: {
                                    _id: res._id
                                },
                                dataType: "json"
                            }).done(function (res) {
                                for(edu = res.education, d = "", e = 0; e < edu.length; e++){
                                    if(0 == e % 2){
                                        d += '<li data-id="' + edu[e]._id + '" class="clear">';
                                    }else {
                                        d += '<li data-id="' + edu[e]._id + '">'
                                    }
                                    d += '<i class="sm_del dn"></i><i class="sm_edit dn"></i><span class="c9" data-startY="' + edu[e].began + '" data-endY="' + edu[e].ended + '">' + edu[e].began + "-" + edu[e].ended + "</span>" + "<div>" + '<h3 data-name="' + edu[e].school + '">' + edu[e].school + "</h3>" + '<h4 data-nature="' + edu[e].nature + '"data-profession="' + edu[e].profession + '"data-degree="' + edu[e].degree + '">' + edu[e].degree + ',' + edu[e].profession + ',' + edu[e].nature + "</h4>" + "</div>" + "</li>";
                                }
                                education.obj.children(".c_add").removeClass("dn");
                                education.obj.children(".educationalShow").children(".educationalForm").hide();
                                education.obj.children(".educationalShow").children(".elist").html(d).parent().removeClass("dn");
                                education.obj.children(".educationalEdit").addClass("dn");
                                $("#lastChangedTime span").text(res.updated);
                                $("#resumeScore .which span").attr("rel", 'workExperience');
                            })
                            scoreChange(res.completeScore);
                            k(education.obj);
                            $(a).find(":submit").val("保 存").attr("disabled", !1)
                        }else{
                            alert(res.error);
                        }
                    })
                }
            })
        });
        // $(".select_relation").bind("click", function (a) {
        //     a.stopPropagation(), $(this).addClass("select_focus"), $("#box_relation").show()
        // });
        // $("#box_relation").on("click", "ul li", function (a) {
        //     a.stopPropagation();
        //     var b = $(this).text();
        //     $(".select_relation").val(b).css("color", "#333").removeClass("select_focus");
        //     $("#relation").val(b);
        //     $("#box_relation").hide(), $(this).parents(".familyForm").validate().element($("#relation"))
        // });

        $("#family").on("click", ".select_relation", function (a) {
            a.stopPropagation(), $(".profile_select_normal").removeClass("select_focus"), $(".boxUpDown").hide(), $(this).addClass("select_focus"), $(this).siblings("#box_relation").show()
        });
        $("#family").on("click", "#box_relation li", function (a) {
            var b;
            a.stopPropagation(), b = $(this).text(), $(this).parents("#box_relation").siblings(".select_relation").val(b).css("color", "#333").removeClass("select_focus"), $(this).parents("#box_relation").siblings(".select_relation").val(b), $(this).parents("#box_relation").hide()
        })
        family = {
            obj: $("#family"),
            resetForm: function () {
                this.obj.children(".familyEdit").find("#name").val(""), this.obj.children(".familyEdit").find("#relation").val(""), this.obj.children(".familyEdit").find("#company").val(""), this.obj.children(".familyEdit").find("#position").css("color", "#999").val(""), this.obj.children(".familyEdit").find("#domicile").val(""), this.obj.children(".familyEdit").find(".familyId").val("")
            },
            Add: function () {
                this.resetForm(), placeholderFn(), this.obj.children(".familyAdd").addClass("dn"), this.obj.children(".familyShow").addClass("dn"), this.obj.children(".familyEdit").removeClass("dn"),familyForm(); j(this.obj)
            },
            AddMore: function () {
                this.resetForm(), placeholderFn(), this.obj.children(".familyShow").prepend(this.obj.children(".familyEdit").children("form").clone()), this.obj.children(".familyShow").children("form").css("borderBottom", "1px solid #e5e5e5").show(), this.obj.children(".familyEdit").addClass("dn"), familyForm(); j(this.obj)
            },
            Edit: function (a) {
                var m,
                    b = a.parents("li"),
                    c = b.attr("data-id"),
                    d = b.find("div.f16").attr("data-name"),
                    f = b.find("div.f16").attr("data-position"),
                    g = b.find("div.f16").attr("data-relation"),
                    h = b.find("div.f16").attr("data-company"),
                    domicile = b.find("div.f16").attr("data-domicile"),
                    l = b.find(".dl1").html();
                l && (l = $.trim(l.replace(/<br>/gi, ""))), this.resetForm();
                m = this.obj.children(".familyEdit").children("form").clone();
                m.find("#name").val(d);
                m.find("#position").css("color", "#333").val(f);
                m.find("#relation").val(g);
                m.find(".select_relation").css("color", "#333").val(g);
                m.find("#company").val(h);
                m.find("#domicile").val(domicile);
                m.find(".familyId").val(c);
                a.parents("li").prepend(m), placeholderFn(), a.parents("li").children(".familyList").addClass("dn");
                familyForm();
                j(this.obj)
            },
            Del: function (a) {
                var b = a.parents("li").attr("data-id");
                $.ajax({
                    url: "/resume/deleteFamily",
                    type: "POST",
                    data: {id: b}
                }).done(function (res) {
                    if(res.error) alert(res.error);
                    else{
                        a.parents("li").remove();
                        $("ul.flist li:last-child").addClass("noborder");
                        if("" == res.family || null == res.family) {
                            family.obj.children(".familyShow").addClass("dn");
                            family.obj.children(".familyEdit").addClass("dn");
                            family.obj.children(".familyAdd").removeClass("dn");
                            family.obj.children(".c_add").addClass("dn");
                        }
                        else{
                            family.obj.children(".familyShow").children(".familyForm").hide()
                        }
                        $("#lastChangedTime span").text(res.updated);
                        scoreChange(res.completeScore);
                        k($("#basicInfo"));
                    }
                })
            }, AddCancel: function () {
                this.obj.find(".familyAdd").removeClass("dn");
                this.obj.find(".familyShow").addClass("dn");
                this.obj.find(".familyEdit").addClass("dn");
                k(this.obj)
            }, AddMoreCancel: function (a) {
                a.parents(".familyForm").siblings(".familyList").removeClass("dn");
                a.parents(".familyForm").remove();
                k(this.obj)
            }
        };
        family.obj.find(".flist li:last-child").addClass("noborder");
        family.obj.find(".familyAdd").bind("click", function () {
            family.Add()
        });
        family.obj.find(".c_add").bind("click", function () {
            family.AddMore(), $(this).addClass("dn")
        });
        family.obj.on("click", ".sm_edit", function () {
            family.Edit($(this))
        });
        family.obj.on("click", ".sm_del", function () {
            confirm("确认要删除吗？") && family.Del($(this))
        });
        family.obj.children(".familyShow").on({
            mouseenter: function () {
                $(this).children(".flist").find(".sm_del,.sm_edit").removeClass("dn")
            }, mouseleave: function () {
                $(this).children(".flist").find(".sm_del,.sm_edit").addClass("dn")
            }
        });
        family.obj.children(".familyEdit").find(".btn_profile_cancel").bind("click", function () {
            family.AddCancel()
        });
        family.obj.children(".familyShow").on("click", ".btn_profile_cancel", function () {
            family.AddMoreCancel($(this)), family.obj.find(".c_add").removeClass("dn")
        });
        familyForm();
        // family.obj.on("click", ".select_relation", function () {
        //     $(this).addClass("select_focus"), $("#box_relation").show()
        // });
        // family.obj.on("click", "#box_relation ul li", function () {
        //     var b = $(this).text();
        //     $(".select_relation").val(b).css("color", "#333").removeClass("select_focus");
        //     $("#relation").val(b);
        //     $("#box_relation").hide(), $(this).parents(".familyForm").validate().element($("#relation"))
        // });

        g = {
            obj: $("#selfDescription"), text: $("#selfDescription .selfDescription").val(), Add: function () {
                this.obj.children(".descriptionEdit").find(".selfDescription").val(""), this.obj.children(".descriptionAdd").addClass("dn"), this.obj.children(".descriptionShow").addClass("dn"), this.obj.children(".descriptionEdit").removeClass("dn"), j(this.obj)
            }, Edit: function () {
                var b = this.obj.children(".descriptionShow").html();
                b = $.trim(b.replace(/<br>/gi, "")), this.text = b, this.obj.children(".descriptionEdit").find(".selfDescription").val(b), this.obj.children(".descriptionEdit").find(".word_count").children("span").text(500 - b.length), this.obj.children(".descriptionShow").addClass("dn"), this.obj.children(".descriptionEdit").removeClass("dn"), this.obj.children(".c_edit").addClass("dn"), j(this.obj)
            }, Cancel: function () {
                this.text ? (this.obj.children(".descriptionAdd").addClass("dn"), this.obj.children(".descriptionShow").removeClass("dn"), this.obj.children(".descriptionEdit").addClass("dn"), this.obj.children(".c_edit").removeClass("dn")) : (this.obj.children(".descriptionAdd").removeClass("dn"), this.obj.children(".descriptionShow").addClass("dn"), this.obj.children(".descriptionEdit").addClass("dn")), k(this.obj)
            }
        }, g.obj.children(".descriptionAdd").bind("click", function () {
            g.Add()
        }), g.obj.children(".c_edit").bind("click", function () {
            g.Edit()
        }), g.obj.children(".descriptionEdit").find(".btn_profile_cancel").bind("click", function () {
            g.Cancel()
        }), g.obj.on("keyup", ".s_textarea", function () {
            textCounter("selfDescription", "", 500)
        }), $(".descriptionForm").validate({
            rules: {selfDescription: {required: !1}}, submitHandler: function (a) {
                var b = $('textarea[name="selfDescription"]', a).val(), c = $("#resumeId").val(), d = $("#resubmitToken").val();
                $(a).find(":submit").val("保存中...").attr("disabled", !0), $.ajax({
                    url: ctx + "/resume/intro.json",
                    type: "POST",
                    data: {myRemark: b, id: c, resubmitToken: d},
                    dataType: "json"
                }).done(function (b) {
                    var c, d;
                    $("#resubmitToken").val(b.resubmitToken), b.success ? (c = b.content.resume, d = "", c.myRemark ? (d = c.myRemark, g.text = c.myRemark, g.obj.children(".c_edit").removeClass("dn"), g.obj.children(".descriptionShow").html(d).removeClass("dn"), g.obj.children(".descriptionEdit").addClass("dn"), $("#lastChangedTime span").text(b.content.refreshTime), $("#resumeScore .which div").text(b.content.infoCompleteStatus.msg), $("#resumeScore .which span").attr("rel", b.content.infoCompleteStatus.nextStage), scoreChange(b.content.infoCompleteStatus.score), k(g.obj)) : (g.text = "", g.obj.children(".c_edit").addClass("dn"), g.obj.children(".descriptionShow").addClass("dn"), g.obj.children(".descriptionEdit").addClass("dn"), g.obj.children(".descriptionAdd").removeClass("dn"), $("#lastChangedTime span").text(b.content.refreshTime), $("#resumeScore .which div").text(b.content.infoCompleteStatus.msg), $("#resumeScore .which span").attr("rel", b.content.infoCompleteStatus.nextStage), scoreChange(b.content.infoCompleteStatus.score), k(g.obj)), b.content.isNew && changeAllIds(b.content.jsonIds)) : alert(b.msg), $(a).find(":submit").val("保 存").attr("disabled", !1)
                })
            }
        });
        strength = {
            obj: $("#strength"),
            text: $("#strength .strength").val(),
            Add: function () {
                this.obj.children(".strengthEdit").find(".strength").val("");
                this.obj.children(".strengthAdd").addClass("dn");
                this.obj.children(".strengthShow").addClass("dn");
                this.obj.children(".strengthEdit").removeClass("dn")
                j(this.obj)
            },
            Edit: function () {
                var b = this.obj.children(".strengthShow").html();
                b = $.trim(b.replace(/<br>/gi, ""));
                this.text = b;
                this.obj.children(".strengthEdit").find(".strength").val(b);
                this.obj.children(".strengthEdit").find(".word_count").children("span").text(500 - b.length);
                this.obj.children(".strengthShow").addClass("dn");
                this.obj.children(".strengthEdit").removeClass("dn");
                this.obj.children(".c_edit").addClass("dn");
                j(this.obj)
            },
            Cancel: function () {
                this.text ? (this.obj.children(".strengthAdd").addClass("dn"), this.obj.children(".strengthShow").removeClass("dn"), this.obj.children(".strengthEdit").addClass("dn"), this.obj.children(".c_edit").removeClass("dn")) : (this.obj.children(".strengthAdd").removeClass("dn"), this.obj.children(".strengthShow").addClass("dn"), this.obj.children(".strengthEdit").addClass("dn")), k(this.obj)
            }
        }, strength.obj.children(".strengthAdd").bind("click", function () {
            strength.Add()
        }), strength.obj.children(".c_edit").bind("click", function () {
            strength.Edit()
        }), strength.obj.children(".strengthEdit").find(".btn_profile_cancel").bind("click", function () {
            strength.Cancel()
        }), strength.obj.on("keyup", ".s_textarea", function () {
            textCounter("strength", "", 500)
        });
        $(".strengthForm").validate({
            rules: {
                strength: {required: !1}
            },
            submitHandler: function (a) {
                var strengthText = $('textarea[name="strength"]', a).val(),
                    c = $("#_id").val();
                $(a).find(":submit").val("保存中...").attr("disabled", !0);
                $.ajax({
                    url: "/resume/upsertResume",
                    type: "POST",
                    data: {
                        strength: strengthText,
                        _id: c
                    },
                    dataType: "json"
                }).done(function (res) {
                    if(!res.error) {
                        if(res.strength){
                            strength.text = res.strength;
                            strength.obj.children(".c_edit").removeClass("dn");
                            strength.obj.children(".strengthShow").html(res.strength).removeClass("dn");
                            strength.obj.children(".strengthEdit").addClass("dn");
                        }else{
                            strength.text = "";
                            strength.obj.children(".c_edit").addClass("dn");
                            strength.obj.children(".strengthShow").addClass("dn");
                            strength.obj.children(".strengthEdit").addClass("dn");
                            strength.obj.children(".strengthAdd").removeClass("dn");
                        }
                        $("#lastChangedTime span").text(res.updated);
                        $("#resumeScore .which span").attr("rel", res.next);
                        scoreChange(res.completeScore);
                        k(strength.obj)
                    }else{
                        alert(res.error);
                    }
                    $(a).find(":submit").val("保 存").attr("disabled", !1)
                })
            }
        });
        prize = {
            obj: $("#prize"),
            text: $("#prize .prize").val(),
            Add: function () {
                this.obj.children(".prizeEdit").find(".prize").val("");
                this.obj.children(".prizeAdd").addClass("dn");
                this.obj.children(".prizeShow").addClass("dn");
                this.obj.children(".prizeEdit").removeClass("dn")
                j(this.obj)
            },
            Edit: function () {
                var b = this.obj.children(".prizeShow").html();
                b = $.trim(b.replace(/<br>/gi, ""));
                this.text = b;
                this.obj.children(".prizeEdit").find(".prize").val(b);
                this.obj.children(".prizeEdit").find(".word_count").children("span").text(500 - b.length);
                this.obj.children(".prizeShow").addClass("dn");
                this.obj.children(".prizeEdit").removeClass("dn");
                this.obj.children(".c_edit").addClass("dn");
                j(this.obj)
            },
            Cancel: function () {
                this.text ? (this.obj.children(".prizeAdd").addClass("dn"), this.obj.children(".prizeShow").removeClass("dn"), this.obj.children(".prizeEdit").addClass("dn"), this.obj.children(".c_edit").removeClass("dn")) : (this.obj.children(".prizeAdd").removeClass("dn"), this.obj.children(".prizeShow").addClass("dn"), this.obj.children(".prizeEdit").addClass("dn")), k(this.obj)
            }
        }, prize.obj.children(".prizeAdd").bind("click", function () {
            prize.Add()
        }), prize.obj.children(".c_edit").bind("click", function () {
            prize.Edit()
        }), prize.obj.children(".prizeEdit").find(".btn_profile_cancel").bind("click", function () {
            prize.Cancel()
        }), prize.obj.on("keyup", ".s_textarea", function () {
            textCounter("prize", "", 500)
        });
        $(".prizeForm").validate({
            rules: {
                strength: {required: !1}
            },
            submitHandler: function (a) {
                var prizeText = $('textarea[name="prize"]', a).val(),
                    c = $("#_id").val();
                $(a).find(":submit").val("保存中...").attr("disabled", !0);
                $.ajax({
                    url: "/resume/upsertResume",
                    type: "POST",
                    data: {
                        prize: prizeText,
                        _id: c
                    },
                    dataType: "json"
                }).done(function (res) {
                    if(!res.error) {
                        if(res.prize){
                            prize.text = res.prize;
                            prize.obj.children(".c_edit").removeClass("dn");
                            prize.obj.children(".prizeShow").html(res.prize).removeClass("dn");
                            prize.obj.children(".prizeEdit").addClass("dn");
                        }else{
                            prize.text = "";
                            prize.obj.children(".c_edit").addClass("dn");
                            prize.obj.children(".prizeShow").addClass("dn");
                            prize.obj.children(".prizeEdit").addClass("dn");
                            prize.obj.children(".prizeAdd").removeClass("dn");
                        }
                        $("#lastChangedTime span").text(res.updated);
                        $("#resumeScore .which span").attr("rel", res.next);
                        scoreChange(res.completeScore);
                        k(prize.obj)
                    }else{
                        alert(res.error);
                    }
                    $(a).find(":submit").val("保 存").attr("disabled", !1)
                })
            }
        });

        h = {
            obj: $("#worksShow"), resetForm: function () {
                this.obj.children(".workEdit").find(".workLink").val(""), this.obj.children(".workEdit").find(".workDescription").val(""), this.obj.children(".workEdit").find(".showId").val(""), this.obj.children(".workEdit").find(".word_count").children("span").text(100)
            }, Add: function () {
                this.resetForm(), placeholderFn(), this.obj.children(".workAdd").addClass("dn"), this.obj.children(".workShow").addClass("dn"), h.obj.children(".workShow").find("form").addClass("dn"), this.obj.children(".workEdit").removeClass("dn"), j(this.obj)
            }, AddMore: function () {
                this.resetForm(), this.obj.children(".workShow").prepend(this.obj.children(".workEdit").children("form").clone()), this.obj.children(".workEdit").addClass("dn"), placeholderFn(), i(), j(this.obj)
            }, Edit: function (a) {
                var f, b = a.parents("li"), c = b.attr("data-id"), d = b.find("div.f16 a").text(), e = b.find("p").html();
                e && (e = $.trim(e.replace(/<br>/gi, ""))), this.resetForm(), f = this.obj.children(".workEdit").children("form").clone(), f.find(".workLink").val(d), f.find(".workDescription").val(e), f.find(".word_count").children("span").text(100 - f.find(".workDescription").val().length), f.find(".showId").val(c), a.parents("li").prepend(f), placeholderFn(), a.parents("li").children(".workList").addClass("dn"), i(), j(this.obj)
            }, Del: function (a) {
                var b = a.parents("li").attr("data-id");
                $.ajax({url: ctx + "/workShow/delws.json", type: "POST", data: {id: b}}).done(function (b) {
                    b.success ? (a.parents("li").remove(), $("ul.slist li:last-child").addClass("noborder"), ("" == b.content.workShows || null == b.content.workShows) && (h.obj.children(".workShow").addClass("dn"), h.obj.children(".workEdit").addClass("dn"), h.obj.children(".workAdd").removeClass("dn"), h.obj.children(".c_add").addClass("dn")), $("#lastChangedTime span").text(b.content.refreshTime), $("#resumeScore .which div").text(b.content.infoCompleteStatus.msg), $("#resumeScore .which span").attr("rel", b.content.infoCompleteStatus.nextStage), scoreChange(b.content.infoCompleteStatus.score), k(h.obj), b.content.isNew && changeAllIds(b.content.jsonIds)) : alert(b.msg)
                })
            }, AddCancel: function () {
                this.obj.find(".workAdd").removeClass("dn"), this.obj.find(".workShow").addClass("dn"), this.obj.find(".workEdit").addClass("dn"), k(this.obj)
            }, AddMoreCancel: function (a) {
                a.parents(".workForm").siblings(".workList").removeClass("dn"), a.parents(".workForm").remove(), 0 == $("ul.slist li").length && $(".workAdd").removeClass("dn"), k(this.obj)
            }
        }, h.obj.find(".slist li:last-child").addClass("noborder"), h.obj.find(".workAdd").bind("click", function () {
            h.Add()
        }), h.obj.find(".c_add").bind("click", function () {
            h.AddMore(), $(this).addClass("dn")
        }), h.obj.on("click", ".sm_edit", function () {
            h.Edit($(this))
        }), h.obj.on("click", ".sm_del", function () {
            confirm("确认要删除吗？") && h.Del($(this))
        }), h.obj.children(".workShow").on({
            mouseenter: function () {
                $(this).children(".slist").find(".sm_del,.sm_edit").removeClass("dn")
            }, mouseleave: function () {
                $(this).children(".slist").find(".sm_del,.sm_edit").addClass("dn")
            }
        }), h.obj.children(".workEdit").find(".btn_profile_cancel").bind("click", function () {
            h.AddCancel()
        }), h.obj.children(".workShow").on("click", ".btn_profile_cancel", function () {
            h.AddMoreCancel($(this)), h.obj.find(".c_add").removeClass("dn")
        }), h.obj.on("keyup", ".s_textarea", function () {
            var a = $(this);
            $.trim(a.val()).length > 100 ? a.val($.trim(a.val()).substring(0, 100)) : a.next(".word_count").children("span").text(100 - $.trim(a.val()).length)
        }), i(), $("#resumeSet h2 span").bind("click", function () {
            a = !1;
            var b = $(this).parents("#resumeSet");
            $.ajax({url: ctx + "/mycenter/resume/getAllResumes.json", type: "GET"}).done(function (a) {
                a.success ? (a.content[0].isDefault && (b.find(".resume0").click(), b.children(".defaultResume").val(a.content[0].type)), a.content[1].isDefault && (b.find(".resume1").click(), b.children(".defaultResume").val(a.content[1].type), a.content[1].perfect || (b.find(".setTip").text("在线简历还未达可投递标准，请完善后选择").show(), b.find(".btn_profile_save").attr("disabled", "disabled"))), a.content[0].perfect || a.content[1].perfect || (b.find(".setTip").text("你还没有可投递的简历").show(), b.find(".btn_profile_save").attr("disabled", "disabled")), b.children(".noSet").hide(), b.children("#resumeSetForm").removeClass("dn"), b.children("#resumeSetForm").find('input[type="radio"]').bind("click", function () {
                        1 != $(this).val() || a.content[1].perfect ? 0 != $(this).val() || a.content[0].perfect ? (b.find(".setTip").text("").hide(), b.find(".btn_profile_save").removeAttr("disabled")) : (b.find(".setTip").text("你还没有附件线简历，请上传后选择").show(), b.find(".btn_profile_save").attr("disabled", "disabled")) : (b.find(".setTip").text("在线简历还未达可投递标准，请完善后选择").show(), b.find(".btn_profile_save").attr("disabled", "disabled"))
                    })) : alert(a.msg)
            })
        }), $("#resumeSetForm .btn_profile_cancel").bind("click", function () {
            var b = $(this).parents("#resumeSet"), c = b.children(".defaultResume").val();
            -1 == c ? (b.children(".noSet").show(), b.children(".set0").hide(), b.children(".set1").hide(), b.children("#resumeSetForm").addClass("dn")) : (b.children(".noSet").hide(), b.children(".set" + c).show(), b.children("#resumeSetForm").addClass("dn")), a = !0
        }), $("#resumeSetForm").validate({
            rules: {resume: {required: !0}},
            messages: {resume: {required: "请选择默认投递的简历"}},
            errorPlacement: function (a, b) {
                a.insertBefore($(b).parents("#resumeSetForm").children(".resumeTip"))
            },
            submitHandler: function (b) {
                var c = $('input[name="resume"]:checked', b).val();
                $(b).find(":submit").attr("disabled", !0), $.ajax({
                    url: ctx + "/mycenter/resume/setDefaultResume.json",
                    type: "POST",
                    data: {type: c}
                }).done(function (d) {
                    d.success ? (a = !0, $("#resumeSet .noSet").hide(), $("#resumeSet .set" + c).show(), $("#resumeSet .defaultResume").val(c), $("#resumeSetForm").addClass("dn")) : alert(d.msg), $(b).find(":submit").attr("disabled", !1)
                })
            }
        }), $("#myResume").on("click", ".resumeUploadDiv a.del", function () {
            confirm("你确定要删除该附件吗？删除后你设置的默认投递简历也将失效") && $.ajax({
                url: ctx + "/nearBy/delNearBy.json",
                type: "GET"
            }).done(function (a) {
                a.success ? ($("#myResume h2 a").html("上传简历"), $("#myResume .resumeUploadDiv").html("暂无附件简历")) : alert(a.msg)
            })
        })
    }),
    $(window).load(function(){
        scoreChange($("#resumeScore .scoreVal span").text())
    });