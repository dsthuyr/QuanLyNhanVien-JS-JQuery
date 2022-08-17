$(document).ready(function() {
    new Combobox();
})


class Combobox {
    constructor() {
        this.buildCombobox();
        this.inintEvent();
    }

    /**
     * Thực hiện tạo các sự kiện cho các thành phần của combobox:
     * Author: NVMANH (20/05/2022)
     */
    inintEvent() {
        // Nhấn button hiển thị các item của combobox:
        $(document).on('click', '.m-combobox button', this.btnButtonComboboxOnClick);
        // Chọn item trong combobox:
        $(document).on('click', '.m-combobox .m-combobox-item', this.comboboxItemOnSelect);

    }

    /**
     * 
     * Author: NVMANH (20/05/2022)
     */
    btnButtonComboboxOnClick() {
        // Tìm combobox data của combobox hiện tại:
        let comboboxData = $(this).siblings('.m-combobox-data');
        comboboxData.toggle();
    }

    /**
     * 
     * Author: NVMANH (20/05/2022)
     */
    comboboxItemOnSelect() {
        // Lấy giá trị, text của item được chọn:
        const textSelected = this.textContent;
        const valueSelected = $(this).attr("value");

        // Tìm input của combobox hiện tại:
        var parentOfItem = this.parentElement;
        var input = $(parentOfItem).siblings('input');

        // Hiển thị giá trị vừa được chọn lên input của combobox:
        $(input).val(textSelected);

        $(parentOfItem).hide();
        // Thực hiện lưu giá trị vừa chọn cho element combobox:
        $(this).parents("[mcombobox]").data("value", valueSelected);
    }

    buildCombobox() {
        // Tìm toàn bộ mcombobox có trong ứng dụng:
        var comboboxs = $('mcombobox');
        // Duyệt các combobox và thực hiện build lại html:
        for (const combobox of comboboxs) {
            // Lấy ra id:
            const id = $(combobox).attr('id');
            // api thực hiện lấy dữ liệu:
            const api = $(combobox).attr('api');
            // Property sử dụng làm value:
            const valueProp = $(combobox).attr('valueProp');
            const textProp = $(combobox).attr('textProp');
            // Thực hiện lấy dữ liệu từ api:
            $.ajax({
                type: "GET",
                url: api,
                success: function(data) {
                    // sau khi lấy dữ liệu thì thực hiện việc build HTML cho các item:
                    var comboboxDataHTML = $(`<div class="m-combobox-data">
                                                </div>`);
                    for (const item of data) {
                        var itemHTML = `<div class="m-combobox-item" value="${item[valueProp]}">${item[textProp]}</div>`;
                        comboboxDataHTML.append(itemHTML);
                    }


                    var comboboxHTML = $(` <div id="${id}" mcombobox class="m-combobox">
                                                <input type="text" class="m-combobox-input">
                                                <button class="m-combobox-button"></button>
                                            </div>`);
                    comboboxHTML.append(comboboxDataHTML);

                    // Thay thế HTML của combobox hiện tại:
                    $(combobox).replaceWith(comboboxHTML);
                }
            });

        }
    }


}


$.fn.getValue = function() {
    if (this.length > 0) {
        var isCombobox = this[0].hasAttribute('mcombobox');
        if (isCombobox) {
            var value = this.data("value");
            return value;
        }
    }
}

$.fn.setValue = function(value) {
    if (this.length > 0) {
        // Kiểm tra các item, nếu có item có giá trị tương ứng thì Set, không thì để trống combobox:
        let input = $(this).find('input');
        // Lấy ra các item:
        let items = $(this).find('.m-combobox-item');
        for (const item of items) {
            var currentItemValue = $(item).attr("value");
            if (value == currentItemValue) {
                // Lấy ra text của item:
                var text = item.textContent;
                $(input).val(text);
                $(this).data("value", value);
                break;
            }
        }
    }
}