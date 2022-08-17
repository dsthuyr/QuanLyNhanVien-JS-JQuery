var formMode = "add"
var employeeIDForUpdate = ""
var employeeIDForDelete = ""

$(document).ready(function () {
    // Thực hiện load dữ liệu
    // ---> Gọi API lấy dữ liệu
    loadData()

    // Thực hiện gắn các sự kiện:
    initEvents()

})

/**
 * Thực hiện load dữ liệu lên table
 * Author: dsthuyr (13/05/2022)
 */
function loadData() {
    // Clear dữ liệu cũ:
    $("table#tblListEmployee tbody").empty()
    // Lấy dữ liệu từ API về
    $(".m-loading").show()
    $.ajax({
        type: "get",
        url: "https://amis.manhnv.net/api/v1/Employees",
        success: function (response) {
            // Thực hiện duyệt từng đối tượng có trong mảng dữ liệu            
            let employees = response
            for (const emp of employees) {
                let employeeCode = emp["EmployeeCode"]
                let employeeName = emp["EmployeeName"]
                let gender = emp["Gender"]
                let dateOfBirth = emp["DateOfBirth"]
                let phoneNumber = emp["PhoneNumber"]
                let email = emp["Email"]
                let employeePosition = emp["EmployeePosition"]
                let departmentName = emp["DepartmentName"]
                let salary = emp["Salary"]
                let workStatus = emp["WorkStatus"]

                // Xử lý dữ liệu:
                dateOfBirth = formatDate(dateOfBirth)
                salary = formatCurrencyVND(salary)
                gender = formatGender(gender)

                employeeCode = formatData(employeeCode)
                employeeName = formatData(employeeName)
                phoneNumber = formatData(phoneNumber)
                email = formatData(email)
                employeePosition = formatData(employeePosition)
                departmentName = formatData(departmentName)
                workStatus = formatData(workStatus)

                var trHTML = $(`<tr class="">
                                <td class="text-align-left">${employeeCode}</td>
                                <td class="text-align-left">${employeeName}</td>
                                <td class="text-align-left">${gender}</td>
                                <td class="text-align-center">${dateOfBirth}</td>
                                <td class="text-align-left">${phoneNumber}</td>
                                <td class="text-align-left">${email}</td>
                                <td class="text-align-left">${employeePosition}</td>
                                <td class="text-align-left">${departmentName}</td>
                                <td class="text-align-right">${salary}</td>
                                <td class="text-align-left">${workStatus}</td>
                                </tr>`)
                trHTML.data("entity", emp)
                // Thực hiện binding lên table
                $('table#tblListEmployee tbody').append(trHTML)
            }
            $(".m-loading").hide()
        },
        error: function (response) {
            console.log(response)
        }
    });
}

/**
 * Thực hiện xóa dữ liệu trên form chi tiết nhân viên
 * Author: dsthuyr (13/05/2022)
 */
function clearDataFormEmployee() {
    $("#txtEmployeeCode").val(btnAddOnClick)
    $("#txtEmployeeName").val(null)
    $("#dtDateOfBirth").val(null)
    $("#cbxGender").val(null)
    $("#txtEmployeeIdentityNumber").val(null)
    $("#dtIdentityDate").val(null)
    $("#txtIdentityPlace").val(null)
    $("#txtEmail").val(null)
    $("#txtPhoneNumber").val(null)
    $("#cbxPositionName").val(null)
    $("#cbxDepartmentID").val(null)
    $("#txtPersonalTaxCode").val(null)
    $("#txtSalary").val(null)
    $("#dtJoinDate").val(null)
    $("#cbxWorkStatus").val(null)
}

function initEvents() {

    // Hiển thị form thêm mới
    $("#btnAdd").click(btnAddOnClick)


    // Ẩn dialog hiện tại bằng nút X 
    $(".m-dialog .m-dialog-close").click(function () {
        $(this).parents(".m-dialog").hide()
    })

    // Đồng ý form cảnh báo
    $("#btnAcceptEmployeeAlert").click(function () {
        $("#dlgEmployeeAlert").hide()
        $("input[notValid]")[0].focus()
    })

    // Đồng ý form thông báo thêm thành công
    $("#btnAcceptAddSuccess").click(function () {
        $(this).parents(".m-dialog").hide()
    })

    // Đồng ý form thông báo cập nhật thành công
    $("#btnAcceptEditSuccess").click(function () {
        $(this).parents(".m-dialog").hide()
    })

    // Đồng ý form thông báo cập nhật thành công
    $("#btnAcceptDeleteSuccess").click(function () {
        $(this).parents(".m-dialog").hide()
    })

    // Nhấn đúp chuột khi chọn dòng dữ liệu thì hiển thị
    $("table tbody").on("dblclick", 'tr', function (e) {
        // Hiển thị form thêm mới
        $("#dlgEmployeeDetail").show()
        // lấy ra dữ liệu tương ứng của dòng dữ liệu hiện tại
        let employee = $(this).data("entity")
        $("#txtEmployeeCode").val(employee.EmployeeCode)
        $("#txtEmployeeName").val(employee.EmployeeName)
        $("#dtDateOfBirth").attr("value",formatDataForDateInput(employee.DateOfBirth));     
        $("#cbxGender").val(employee.Gender)
        $("#txtEmployeeIdentityNumber").val(employee.IdentityNumber)
        $("#dtIdentityDate").val("value",formatDataForDateInput(employee.IdentityDate))
        $("#txtIdentityPlace").val(employee.IdentityPlace)
        $("#txtEmail").val(employee.Email)
        $("#txtPhoneNumber").val(employee.PhoneNumber)
        $("#cbxPositionName").val(employee.EmployeePosition)
        $("input.m-combobox-input").val(employee.DepartmentName)
        $("[mcombobox]").data("value",employee.DepartmentId)
        $("#txtPersonalTaxCode").val(employee.PersonalTaxCode)
        $("#txtSalary").val(employee.Salary)
        $("#dtJoinDate").val("value",formatDataForDateInput(employee.JoinDate))
        $("#cbxWorkStatus").val(employee.WorkStatus)

        employeeIDForUpdate = employee.EmployeeId
        formMode = "edit"
        // Focus vào ô ID nhân viên
        $("#txtEmployeeCode")[0].focus()
    })

    // Reload lại bảng khi nhấn nút refresh
    $(".m-content .m-button-refresh").click(function () {
        loadData()
    })

    // Nhấn button cất dữ liệu
    $("#btnSaveEmployeeDetail").click({},btnSaveEmployeeOnClick)

    // Xóa dòng được chọn
    $(".m-table").on("click", "tr", function () {
        // Xóa phần tử được chọn
        $(this).siblings().removeClass("row-selected")
        this.classList.add("row-selected")
        let employee = $(this).data("entity")
        employeeIDForDelete = employee.EmployeeId
        formMode = "delete"
        // $("#btnDeleteEmployee").click(btnDeleteOnClick)

        $("#btnDeleteEmployee").click(function () {
            $("#dlgDeleteConfirm").show()
            $("#btnAcceptDeleteCancel").click(function () {
                $("#dlgDeleteConfirm").hide()
            })
            $("#btnAcceptDeleteConfirm").click(btnDeleteOnClick)
        })
    })

    // Validate email ngay trong form nhập
    $("[m-email]").blur(function () {
        const value = $(this).val()
        if (!isEmail(value) && value != "" && value != null) {
            $(this).attr("notValid", "")
            $(this).attr("title", "Email không hợp lệ")
        }
        else if (value != "" && value != null) {
            $(this).removeAttr("title")
            $(this).removeAttr("notValid")
        }
    })

    // Validate ngày sinh ngay trong form nhập
    var dob = $("#dtDateOfBirth").val()
    if (dob != "") {

        $("#dtDateOfBirth").blur(function () {
            let value = $(this).val()
            value = new Date(value)
            if (!isDOBValid(value)) {
                $(this).attr("notValid", "")
                $(this).attr("title", "Ngày sinh không được lớn hơn ngày hiện tại")
            }
            else {
                $(this).removeAttr("title")
                $(this).removeAttr("notValid")
            }
        })
    }

    // Validate require ngay trong form nhập
    $("[m-require]").blur(function () {
        var value = this.value
        if (value == "" || value == null) {
            // Lấy ra tên của propertyName
            let propertyName = $(this).attr("propertyName")
            $(this).attr("notValid", "")
            $(this).attr("title", `Thông tin ${propertyName} không được để trống`)
        }
        else if ($(this).attr("title") == "Email không hợp lệ") {

        }
        else {
            $(this).removeAttr("title")
            $(this).removeAttr("notValid")
        }
    })

}

/**
 * Thực hiện nhấn cất dữ liệu
 * Author: dsthuyr (15/5/2022)
 */

function btnSaveEmployeeOnClick() {
    //*** Validate dữ liệu khi nhấn lưu
    var isValid = true
    var validateErrors = []
    // 1. Các trường bắt buộc nhập
    let inputRequire = $("input[m-require]")
    for (const input of inputRequire) {
        // Lấy giá trị:
        const value = $(input).val()
        // const value = input.value 
        if (value == "" || value == null) {
            isValid = false
            $(input).attr("notValid", "")
            // Lấy ra tên của propertyName
            let propertyName = $(input).attr("propertyName")
            $(input).attr("title", `Thông tin ${propertyName} không được để trống`)
            validateErrors.push(`Thông tin ${propertyName} không được để trống`)
        }
        else {
            $(input).removeAttr("title")
            $(input).removeAttr("notValid")
        }
    }

    // 2. Email đúng định dạng
    let inputEmail = $("input[m-email]")
    const value = $(inputEmail).val()
    if (!isEmail(value) && value != "" && value != null) {
        isValid = false
        $(inputEmail).attr("notValid", "")
        $(inputEmail).attr("title", `Email không hợp lệ`)
        validateErrors.push(`Email không hợp lệ`)
    }
    else if (value != "" && value != null) {
        $(inputEmail).removeAttr("title")
        $(inputEmail).removeAttr("notValid")
    }

    // 3. Ngày sinh không đc lớn hơn ngày tạo
    var dob = $("#dtDateOfBirth").val()
    if (dob != "") {
        dob = new Date(dob)
        if (!isDOBValid(dob)) {
            isValid = false
            $("#dtDateOfBirth").attr("notValid", "")
            $("#dtDateOfBirth").attr("title", "Ngày sinh không được lớn hơn ngày tạo")
            validateErrors.push("Ngày sinh không được lớn hơn ngày tạo")
        }
        else {
            $("#dtDateOfBirth").removeAttr("notValid")
            $("#dtDateOfBirth").removeAttr("title")
        }
    }

    // Nếu validate không hợp lệ, thì hiển thị cảnh báo validate
    if (!isValid) {
        $("#dlgEmployeeAlert .m-dialog-text").text("Dữ liệu đầu vào không hơp lệ")
        for (const errMsg of validateErrors) {
            $("#dlgEmployeeAlert .m-dialog-text").append(`<br>- ${errMsg}`)
        }
        $("#dlgEmployeeAlert").show()

        return
    }

    //*** Nếu tất cả các validate hợp lệ thì thực hiết gọi API cất dữ liệu
    // 1. Build Object
    let employee = {
        "EmployeeCode": $("#txtEmployeeCode").val(),
        "EmployeeName": $("#txtEmployeeName").val(),
        "DateOfBirth": $("#dtDateOfBirth").val(),
        "Gender": $("#cbxGender").val(),
        "IdentityNumber": $("#txtEmployeeIdentityNumber").val(),
        "IdentityDate": $("#dtIdentityDate").val(),
        "IdentityPlace": $("#txtIdentityPlace").val(),
        "Email": $("#txtEmail").val(),
        "PhoneNumber": $("#txtPhoneNumber").val(),
        "PositionName": $("#cbxPositionName").val(),
        "EmployeePosition": $("#cbxPositionName").val(),
        "PersonalTaxCode": $("#txtPersonalTaxCode").val(),
        "Salary": $("#txtSalary").val(),
        "JoinDate": $("#dtJoinDate").val(),
        "WorkStatus": $("#cbxWorkStatus").val(),
        "DepartmentId": $("[mcombobox]").data("value"),
    }

    console.log(employee)

    // 2. Gọi api thực hiện thêm mới 
    // 3. Hiển thị loading:
    $(".m-loading").show()
    if (formMode == "add") {
        $.ajax({
            type: "POST",
            url: "https://amis.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function (response) {
                // 4. Sau khi thực hiện xong: Ẩn loading, ẩn form chi tiết, load lại dữ liệu
                $(".m-loading").hide()
                $("#dlgEmployeeDetail").hide()
                loadData()
                // 5. Hiển thị toast messenger thông báo thành công
                $("#dlgAddSuccess").show()
                // 6. Clear dữ liệu form chi tiết nhân viên
                clearDataFormEmployee()
                $("#dlgEmployeeDetail").hide()
            },
            error: function (response) {
                alert(response.responseJSON.userMsg)
                $(".m-loading").hide()
            }
        })
    } {
        $.ajax({
            type: "PUT",
            url: `https://amis.manhnv.net/api/v1/Employees/${employeeIDForUpdate}`,
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function (response) {
                // 4. Sau khi thực hiện xong: Ẩn loading, ẩn form chi tiết, load lại dữ liệu
                $(".m-loading").hide()
                $("#dlgEmployeeDetail").hide()
                loadData()
                // 5. Hiển thị toast messenger thông báo thành công
                $("#dlgEditSuccess").show()
                 // 6. Clear dữ liệu form chi tiết nhân viên
                clearDataFormEmployee()
                $("#dlgEmployeeDetail").hide()

            },
            error: function (response) {
                alert(response.responseJSON.userMsg)
                $(".m-loading").hide()
            }
        })
    }

}

function btnDeleteOnClick() {
    $.ajax({
        type: "DELETE",
        url: `https://amis.manhnv.net/api/v1/Employees/${employeeIDForDelete}`,
        success: function (response) {
            // 4. Sau khi thực hiện xong: Ẩn loading, ẩn form chi tiết, load lại dữ liệu
            $(".m-loading").hide()
            loadData()
            // 5. Hiển thị toast messenger thông báo thành công
            $("#dlgDeleteSuccess").show()

        },
        error: function (response) {
            alert(response.responseJSON.userMsg)
            $(".m-loading").hide()
        }
    })
    $("#dlgDeleteConfirm").hide()
}


/**
 * Hàm tự động lấy mã nhân viên mới
 * @param {Date} date 
 * Author: dsthuyr (13/05/2022)
 */
function btnAddOnClick() {
    // Hiển thị form chi tiết nhân viên
    $("#dlgEmployeeDetail").show()
    // Lấy mã nhân viên mới và binding thông tin vào input 
    // Focus vào ô nhập liệu
    $.ajax({
        type: "GET",
        url: "https://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
        success: function (response) {
            $("#txtEmployeeCode").val(response)
            $("#dlgEmployeeDetail input")[0].focus()
        }
    });
}

/**
 * Hàm định dạng hiển thị ngày/tháng/năm
 * @param {Date} date 
 * Author: dsthuyr (13/05/2022)
 */
function formatDate(date) {
    if (date != null) {
        date = new Date(date);
        let day = date.getDay()
        day = day < 10 ? `0${day}` : day
        let month = date.getMonth() + 1
        month = month < 10 ? `0${month}` : month
        let year = date.getFullYear()

        return `${day}/${month}/${year}`   // VD: 13/5/2022
    }
    else {
        return ""
    }
}


/**
 * Hàm định dạng hiển thị lương 
 * @param {Number} salary
 * Author: dsthuyr (13/05/2022)
 */
function formatCurrencyVND(salary) {
    if (salary != null) {
        salary = 1234234923
        salary = (new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary))
        return salary
    }
    else {
        return ""
    }
}

/**
 * Hàm định dạng hiển thị checkbox
 * @param {boolean} check
 * Author: dsthuyr (13/05/2022)
 */
function formatCheckbox(check) {
    if (check != true) {
        return `<input type="checkbox" checked/>`
    }
    else {
        return `<input type="checkbox"/>`
    }
}

/**
 * Hàm định dạng hiển thị Giới tính (Gender)
 * @param {Number} gender
 * Author: dsthuyr (13/05/2022)
 */
function formatGender(gender) {
    if (gender == null) {
        return ""
    }
    else if (gender == 0) {
        return "Khác"
    }
    else if (gender == 1) {
        return "Nam"
    }
    else {
        return "Nữ"
    }
}

/**
 * Validate email
 * Author: dsthuyr (16/05/2022)
 */
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

/**
 * Validate DateOfBirth
 * 
 * Author: dsthuyr (16/05/2022)
 */
function isDOBValid(dob) {
    let current = new Date()
    if (current.getTime() >= dob.getTime()) {
        return true
    }
    return false
}

/**
 * Hàm định dạng hiển thị chung (Chỉ hiển thị nếu giá trị khác null)
 * Author: dsthuyr (17/05/2022)
 */
function formatData(input) {
    if (input != null) {
        return input
    }
    else {
        return ""
    }
}

/**
 * Xử lí ngày tháng đầu vào, để đưa lên input
 * Author: dsthuyr (22/05/2022)
 */
 function formatDataForDateInput(date) {
    if (date != null) {
        date = new Date(date);
        let day = date.getDay()
        day = day < 10 ? `0${day}` : day
        let month = date.getMonth() + 1
        month = month < 10 ? `0${month}` : month
        let year = date.getFullYear()
        return `${year}-${month}-${day}`   // VD: 2022-05-13
    }
    else {
        return ""
    }
}

// Tên id các input form nhân viên
/*
#txtEmployeeCode
#txtEmployeeName
#dtDateOfBirth
#cbxGender
#txtEmployeeIdentityNumber
#dtIdentityDate
#txtIdentityPlace
#txtEmail
#txtPhoneNumber
#cbxPositionName
#cbxDepartmentName
#txtPersonalTaxCode
#txtSalary
#dtJoinDate
#cbxWorkStatus
*/
