
var cupboard = {
	sections: new Array(), // Секции - база
	first: null, // Ссылка на первую секцию в базе
	last: null, // Ссылка на последнюю добавленную секцию в базе
	endwall: null, // Замыкающая стенка
	sizew: null, // Ширина кеш
	sizeg: null, // Глубина кеш
	sizeh: null, // Высота кеш
	sectionmin: 35, // Минимальная ширина секции
	sectionmax: 150, // Максимальная ширина секции
	price: 0,
	params: {},
	tables: {},
	prices: {},
	print: false // Инициализации печати не было, если false
}

$(function() {

	cupboardInit();
	
	$("button.cupboard-about-form").click(cupboardAboutFormShow);
	$("table.cupboard-about-form button.close").click(cupboardAboutFormHide);
	$("table.cupboard-about-form table.form").draggable();
	
});

// // // // // // // // // // // // // // // // // // // // // // // // //

// О ПРОГРАММЕ

function cupboardAboutFormShow() {
	// Открыть фон
	$("div.cupboard-about-form-background")
		.css("opacity", 0.7)
		.height($("body").attr("scrollHeight"))
		.show();
	// Открыть форму
	$("table.cupboard-about-form").show();
}

function cupboardAboutFormHide() {
	// Скрыть форму
	$("table.cupboard-about-form").hide();
	// Скрыть фон
	$("div.cupboard-about-form-background").hide();
}

// // // // // // // // // // // // // // // // // // // // // // // // //

// ИНИЦИАЛИЗАЦИЯ ШКАФА

function cupboardInit() {
	$("div.cupboard-clones table.box1").clone().appendTo("div.cupboard");
	$("div.cupboard-clones div.boxinside").clone().appendTo("div.cupboard table.box1 td.boxinside");
	cupboard.sizew = $("div.cupboard span.sizew span");
	cupboard.sizeg = $("div.cupboard span.sizeg span");
	cupboard.sizeh = $("div.cupboard span.sizeh span");
	cupboard.price = $("div.pane-params span.price");
	cupboard.params.sizeh = $("div.pane-params input.sizeh");
	cupboard.params.sizeg = $("div.pane-params input.sizeg");
	cupboard.params.walltop = $("div.pane-params input.walltop");
	cupboard.params.wallleft = $("div.pane-params input.wallleft");
	cupboard.params.wallback = $("div.pane-params input.wallback");
	cupboard.params.wallright = $("div.pane-params input.wallright");
	cupboard.params.walllower = $("div.pane-params input.walllower");
	cupboard.params.material = $("div.pane-params select.material");
	cupboard.params.doorborder = $("div.pane-params select.doorborder");
	cupboard.tables.fillers = getTableFillers();
	cupboard.tables.mdffillers = getTableMdfFillers();
	cupboard.tables.doorborders = getTableDoorBorders();
	cupboard.prices.materials = getPriceMaterials();
	cupboard.prices.mdffillers = getPriceMdfFillers();
	cupboard.prices.doors = getPriceDoors();
	
	cupboardLoadFillerOptions(
		$("div.cupboard-clones div.door-pane-update select.filler"),
		cupboard.tables.fillers
	);
	var doorborderselector = $("div.pane-params select.doorborder");
	for(var i = 0; i < cupboard.tables.doorborders.length; i++) {
		var doorborder = cupboard.tables.doorborders[i];
		doorborderselector.append("<option value='" + doorborder.id + "'>" + doorborder.label + "</option>");
	}
	
	$("div.pane-params button.calculate").click(cupboardCalculate);
	$("div.pane-params button.print").click(cupboardPrint);
	$("div.pane-params input.walltop").click(cupboardCalculate);
	$("div.pane-params input.wallleft").click(cupboardCalculate);
	$("div.pane-params input.wallback").click(cupboardCalculate);
	$("div.pane-params input.wallright").click(cupboardCalculate);
	$("div.pane-params input.walllower").click(cupboardCalculate);
	$("div.pane-params select.material").click(cupboardCalculate);
	$("div.pane-params select.doorborder").click(cupboardCalculate);
	
	
	cupboardInsertSectionEnd();
	cupboardInsertSectionControlPaneInsert();
	cupboardInsertDoorControlPaneInsert();
	cupboardInitBrace();
	cupboardSetSpines();
	// Выставление значений по умолчанию
	cupboard.params.sizeh.val(250); // Высота шкафа по умолчанию
	cupboard.params.sizeg.val(50); // Глубина шкафа по умолчанию
	cupboard.params.sizeh.change(cupboardSizeHOnChange);
	cupboard.params.sizeg.change(cupboardSizeGOnChange);
	cupboard.params.sizeh.change();
	cupboard.params.sizeg.change();
	cupboardInsertSection();
	cupboardInsertDoor();
	// Подсчитать
	cupboardCalculate();
}

function cupboardLoadFillerOptions(fillerselector, fillers) {
	fillerselector.find("option").remove();
	for(var i = 0; i < fillers.length; i++) {
		var filler = fillers[i];
		fillerselector.append("<option value='" + filler.id + "'>" + filler.label + "</option>");
	}
}

function cupboardSizeHOnChange() {
	if (!isNaN(this.value) && this.value >= 0) {
		cupboard.sizeh.text(this.value);
		cupboardCalculate();		
	} else {
		this.value = 200;
		alert("Введите положительное числовое значение!");
	}
}

function cupboardSizeGOnChange() {
	if (!isNaN(this.value) && this.value >= 0) {
		cupboard.sizeg.text(this.value);
		cupboardCalculate();		
	} else {
		this.value = 50;
		alert("Введите положительное числовое значение!");
	}
}

// РАСПОРКА
// Инициализация распорки

function cupboardInitBrace() {
	var widthbox1 = 0;
	widthbox1 += $("div.cupboard table.box1 td.box1e21").width();
	widthbox1 += $("div.cupboard table.box1 td.box1e23").width();
	widthbox1 += $("div.cupboard td.end").width();
	$("div.cupboard-brace").width(widthbox1);
}

// Выставление высоты шкафа
// Пока размер шкафа выставляется в файле cupboard.css
/*
function cupboardSetHeight(height) {
	$("div.cupboard table.box1 table.box1e2").height(height);
	$("div.cupboard table.inside").height(height);
}
*/

// Добавление секции

function cupboardInsertSection() {
	var first = true;
	var pane1e2a = null;
	// Если есть секции, то вставляем разделитель секций
	if($("div.cupboard tr.sections td.section").size()) {
		pane1e2a = $("<td class='pane1e2a'>&nbsp;</td>");
		cupboard.endwall.before(pane1e2a);
		first = false;
	}
	// Вставка секции из клона и вставка внутренностей секции
	var section = $("<td class='section'></td>");
	cupboard.endwall.before(section);
	$("div.cupboard-clones div.pane1e2").clone().appendTo(section)
		.find("div.pane1e3").append($("div.cupboard-clones table.inside").clone());
	// Особые действия для первой секции
	if (first) {
		$("div.box0e11", section).show();
	}
	// Удлиняем распорку
	var brace = $("div.cupboard-brace");
	brace.width(brace.width() + 100);
	if (!first) {brace.width(brace.width() + 8);}
	// Сохраняем в базе ссылку на секцию
	section = {
		id: cupboard.sections.length,
		pred: cupboard.last,
		next: null,
		td: section,
		width: 100,
		control: null, // Ссылка на управлялку секцией
		controlpane: null, // Ссылка на панель управления секцией
		first: first, // Если равна true, то это первая на деревне секция
		baskets: 0, // Количество корзин в секции
		basket: 0, // Тип корзин в секции
		pans: 0, // Количество полок в секции
		hanger: 0, // Тип вешалки, null если нет вешалки
		pane1e2a: pane1e2a // Ссылка на стенку слева, если не первая секция
	};
	if (!cupboard.first) cupboard.first = section;
	if (cupboard.last) cupboard.last.next = section;
	cupboard.last = section;
	cupboard.sections[cupboard.sections.length] = section;
	// Добавляем панель управления секцией
	cupboardInsertSectionControlPaneUpdate(section);
	$("table.header span.width span", section.controlpane).text(section.td.width());
	// Добавление управлялки секцией
	section.control = $("<div class='control-section' id='" + section.id + "'></div>").appendTo("div.cupboard div.boxinside");
	section.control.draggable(
		{
			axis: "x",
			drag: function(event, ui) {
				var section = cupboard.sections[this.id];
				var newwidth = ui.position.left - section.td.position().left
				var offset = newwidth - section.td.width();
				// Изменяем распорку
				var brace = $("div.cupboard-brace");
				brace.width(brace.width() + offset);
				// и секцию конечно тоже
				section.width = newwidth;
				section.td.width(section.width);
				$("table.header span.width span", section.controlpane).text(section.td.width());
				cupboardUpdateSizeLabels();
				cupboardCalculate();
			},
			stop: cupboardSetSectionDragContainments
		}
	);
	// Расставить управлялки
	cupboardSetSectionDragContainments();
	// Обновить метки размеров
	cupboardUpdateSizeLabels();
	cupboardCalculate();
}

// Обновление меток с размерами шкафа

function cupboardUpdateSizeLabels() {
	// Расчет ширины шкафа
	var section = cupboard.first;
	var width = 0;
	while (section) {
		width += section.td.width();
		section = section.next;	
	}
	cupboard.sizew.text(width);
}

// Добавление замыкающей стенки

function cupboardInsertSectionEnd() {
	// Вставка замыкающей стенки
	cupboard.endwall = $('<td class="end"></td>').appendTo("div.cupboard tr.sections");
	$("div.cupboard-clones div.box0e23").clone().appendTo(cupboard.endwall);
}

// Удаление секции

function cupboardDeleteSection() {
	if ($("div.cupboard tr.sections td.section").size() > 1) {
		var update = $(this).parents("td.control");
		var id = cupboardGetSectionIdFromSectionControlPane(this);
		section = cupboard.sections[id];
		// Особые действия, если это первая секция
		if (section.first && section.next) {
			section.next.first = true;
			cupboard.first = section.next;
			$("div.box0e11", section.next.td).show();
			if (section.next.pane1e2a) { // Удалить стенку между первой и следующей секциями
				section.next.pane1e2a.remove();
				section.next.pane1e2a = null;
			}
		}
		// Переставить указатели в списке секций в базе
		if (!section.next) cupboard.last = section.pred;
		if (section.pred) section.pred.next = section.next;
		if (section.next) section.next.pred = section.pred;
		// Удалить секцию с визуала
		var width = section.td.width();
		section.td.remove();
		if (section.pane1e2a) { width += section.pane1e2a.width(); section.pane1e2a.remove(); }
		// Сократить распорку
		var brace = $("div.cupboard-brace");
		brace.width(brace.width() - width);
		// Удалить управлялку секции с визуала
		section.control.remove();
		// Удалить секцию из базы
		delete section;
		// Удалить панель управления секцией
		update.remove();
		// Пересортировать управлялки заново
		cupboardSetSectionDragContainments();
		// Обновить метки размеров шкафа
		cupboardUpdateSizeLabels();
		// Перенумеровать
		$("div.cupboard-control-sections td.control").each(function(i){
			$("span.number", this).text(i + 1);
		});
		cupboardCalculate();
	}
}

// Добавление панельки добавления новой секции

function cupboardInsertSectionControlPaneInsert() {
	var group = $("div.cupboard-clones table.group-control-sections").clone();
	$("div.cupboard-control-sections").append(group);
	$("td", group).append("<div><button>Добавить секцию</button></div>")
		.find("button").click(cupboardInsertSection);
}

// Раставить и ограничить управлялки секциями

function cupboardSetSectionDragContainments() {
	var sections = cupboard.sections;
	var section = cupboard.first;
	while (section) {
		section.control.css("left", section.td.position().left + section.td.width());
		var offset = section.td.offset().left;
		section.control.draggable(
			"option", "containment",
			[offset + cupboard.sectionmin, 0, offset + cupboard.sectionmax, 0]
		);
		//section.control.css("opacity", 0.5);
		section = section.next;	
	}
}

// Добавление панельки управления секцией

function cupboardInsertSectionControlPaneUpdate(section) {
	section.controlpane = $("<td class='control update'></td>");
	section.controlpane.insertBefore("div.cupboard-control-sections td.insert");
	var update = $("div.cupboard-clones div.section-pane-update").clone();
	section.controlpane.append(update);
	$("span.number", update).attr("id", section.id);
	// Перенумеровать
	$("div.cupboard-control-sections td.control").each(function(i){
		$("span.number", this).text(i + 1);
	});
	// Обработчики
	$("button.delete", update).click(cupboardDeleteSection);
	$("input.baskets", update).change(cupboardInputBasketsOnChange);
	$("select.basket", update).change(cupboardSelectBasketOnChange);
	$("input.pans", update).change(cupboardInputPansOnChange);
	$("select.hanger", update).change(cupboardSelectHangerOnChange);
	// Установка спин-управления полями ввода
	var divfields = $("div.field", update).not(":has(select)");	
	for (var i = 0; i < divfields.size(); i++) {
		var spinid = "spinsection" + i + section.id;
		var divfield = divfields.eq(i);
		divfield.append("<img class='spin' src='cupboard/images/spin.gif' border='0' usemap='#" + spinid + "'>");
		divfield.append("\
			<map name='" + spinid + "'>\
				<area class='up' alt='Увеличить значение' coords='0,0,11,11' href='javascript:void(0)'>\
				<area class='down' alt='Уменьшить значение' coords='0,11,11,22' href='javascript:void(0)'>\
			</map>\
		");
		divfield.find("area.up").click(cupboardSpinAreaUpOnClick);
		divfield.find("area.down").click(cupboardSpinAreaDownOnClick);
	}
}

// Обработчик параметра тип корзины

function cupboardSelectBasketOnChange() {
	var value = $(this).val();
	var id = cupboardGetSectionIdFromSectionControlPane(this);
	var section = cupboard.sections[id];
	section.basket = value;
	var baskets = $(this).parents("div.baskets").find("input.baskets");
	if (value > 0 && baskets.val() <= 0) { baskets.val(1); baskets.change(); }
	if (value <= 0 && baskets.val() > 0) { baskets.val(0); baskets.change(); }
	cupboardCalculate();
}

// Обработчик параметра вешалка

function cupboardSelectHangerOnChange() {
	var value = $(this).val();
	var id = cupboardGetSectionIdFromSectionControlPane(this);
	var section = cupboard.sections[id];
	var hanger;
	if (section.hanger > 0) {
		// Удалить вешалку
		section.hanger = 0;
		hanger = $("table.inside div.hanger1, table.inside div.hanger2", section.td);
		hanger.remove();
		cupboardSetupDragContainmentPansInSection(section);
	}
	if (value > 0) {
		section.hanger = value;
		// Вставить новую вешалку
		hanger = $("<div class='hanger" + value + "'>&nbsp;</div>").appendTo($("table.inside div.pans", section.td));
		// Скорректировать полки
		cupboardSetupPansInSection(section)
	}
	cupboardCalculate();
}

// Обработчик количества полок в секции

function cupboardInputPansOnChange() {
	var value = $(this).val();	
	if (!isNaN(value) && value >= 0) {
		var id = cupboardGetSectionIdFromSectionControlPane(this);
		var section = cupboard.sections[id];
		// Обновить число полок в секции в базе
		section.pans = parseInt(value);
		// Расставить заново
		cupboardSetupPansInSection(section);
		cupboardCalculate();
	} else {
		$(this).val(0);
		alert("Введите положительное числовое значение!");
	}
}

// Перераспределение полок в секции

function cupboardSetupPansInSection(section) {
	var value = section.pans;
	// Удалить все полки
	var pans = $("table.inside div.pan", section.td);
	pans.remove();
	// Расставить заново
	var hanger = (section.hanger > 0) ? 57: 0;
	var height = $("table.inside div.pans", section.td).height() - hanger;
	var offset = 0, delta = 0;
	var pan = null;
	for (var i = 1; i <= value; i++) {
		pan = $("<div class='pan' id='" + section.id + "'>&nbsp;</div>").prependTo($("table.inside div.pans", section.td));
		delta = (height - value * pan.height()) / (value + 1);
		offset += delta;
		pan.css("top", offset + hanger);
		offset += pan.height();
		pan.draggable(
			{
				axis: "y",
				stop: cupboardSetupDragContainmentPansInSection
			}
		);
	}
	cupboardSetupDragContainmentPansInSection(section);
}

// Перераспределение полей ограничений движения drag для полок секции

function cupboardSetupDragContainmentPansInSection(section) {
	if (section.hanger === undefined) section = cupboard.sections[this.id];
	var divpans = $("table.inside div.pans", section.td);
	var pans = $("table.inside div.pan", section.td);
	var hanger, prev, next, y1, y2;
	pans.each(function(){
		next = $(this).next("div.pan");
		if (next.size()) {
			y1 = next.offset().top + 8;
		} else {
			hanger = (section.hanger > 0) ? 57: 0;
			y1 = divpans.offset().top + hanger;
		}
		prev = $(this).prev("div.pan");
		if (prev.size()) {
			y2 = prev.offset().top + prev.height() - $(this).height() - 8;
		} else {
			y2 = divpans.offset().top + divpans.height() - $(this).height();
		}
		$(this).draggable("option", "containment", [0, y1, 0, y2]);
	});
}

// Обработчик количества корзин в секции

function cupboardInputBasketsOnChange() {
	var value = $(this).val();	
	if (!isNaN(value) && value >= 0) {
		// Выставление значения соседа
		var basket = $(this).parents("div.baskets").find("select.basket");
		if (value > 0 && basket.val() <= 0) basket.val(1);
		if (value <= 0 && basket.val() > 0) basket.val(0);
		// Продолжаем
		var id = cupboardGetSectionIdFromSectionControlPane(this);
		var section = cupboard.sections[id];
		var baskets = $("table.inside tr.basket2", section.td);
		var change = value - baskets.size();
		// Добавление корзин
		if (change > 0) {
			if (baskets.size() == 0) $("table.inside tr", section.td).addClass("basket1");
			for (var i = 1; i <= change; i++)
				$("table.inside", section.td).append("<tr class='basket2'><td>&nbsp;</td></tr>");
		}
		// Удаление корзин
		if (change < 0) {
			change = Math.abs(change);
			baskets = $("table.inside tr.basket2:lt(" + change + ")", section.td);
			baskets.remove();
			if (value == 0) $("table.inside tr.basket1", section.td).removeClass("basket1");
		}
		// Обновление числа корзин в секции в базе
		baskets = $("table.inside tr.basket2", section.td);
		section.baskets = baskets.size();
		// Перераспределить полки в секции с учетом нового числа корзин
		cupboardSetupPansInSection(section);
		cupboardCalculate();
	} else {
		$(this).val(0);
		alert("Введите положительное числовое значение!");
	}
}

// Получить номер id секции в базе из панельки управления секцией

function cupboardGetSectionIdFromSectionControlPane(context) {
	return $(context).parents("td.control").find("span.number").attr("id");
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// УПРАВЛЕНИЕ ДВЕРЯМИ

// Добавление панельки добавления новой двери

function cupboardInsertDoorControlPaneInsert() {
	var group = $("div.cupboard-clones table.group-control-doors").clone();
	$("div.cupboard-control-doors").append(group);
	$("td", group).append("<div><button>Добавить дверь</button></div>")
		.find("button").click(cupboardInsertDoor);
}

// Добавление панельки управления дверью

function cupboardInsertDoor() {
	var controlpane = $("<td class='control update'></td>");
	controlpane.insertBefore("div.cupboard-control-doors td.insert");
	var update = $("div.cupboard-clones div.door-pane-update").clone();
	controlpane.append(update);
	// Перенумеровать
	$("div.cupboard-control-doors td.control").each(function(i){
		$("span.number", this).text(i + 1);
	});
	// Обработчики
	$("button.delete", update).click(cupboardDeleteDoor);
	$("input.mdf", update).click(cupboardCheckboxMdfOnChange);
	$("select.filler", update).change(cupboardSelectFillerOnChange);
	cupboardCalculate();
}

function cupboardSelectFillerOnChange() {
	cupboardCalculate();
}

function cupboardCheckboxMdfOnChange() {
	fillerselector = $(this).parents("div.door-pane-update").find("select.filler");
	if ($(this).attr("checked")) {
		cupboardLoadFillerOptions(fillerselector, cupboard.tables.mdffillers);
	} else {
		cupboardLoadFillerOptions(fillerselector, cupboard.tables.fillers);
	}
	if ($.browser.msie) fillerselector.css("width", fillerselector.css("width"));
	cupboardCalculate();
}

// Удаление панельки управления дверью

function cupboardDeleteDoor() {
	// Удалить панель
	$(this).parents("td.control").remove();
	// Перенумеровать
	$("div.cupboard-control-doors td.control").each(function(i){
		$("span.number", this).text(i + 1);
	});
	cupboardCalculate();
}

// // // // // // // // // // // // // // // // // // // // // // // // //

// Управление полями ввода

function cupboardSetSpines() {
	var fields = $("div.pane-params div.field").not(":has(select)")
		.each(function(i){
			$(this).append("<img class='spin' src='cupboard/images/spin.gif' border='0' usemap='#spin" + i + "'>");
			$(this).append("\
				<map name='spin" + i + "'>\
					<area class='up' alt='Увеличить значение' coords='0,0,11,11' href='javascript:void(0)'>\
					<area class='down' alt='Уменьшить значение' coords='0,11,11,22' href='javascript:void(0)'>\
				</map>\
			");
		});
	fields.find("area.up").click(cupboardSpinAreaUpOnClick);
	fields.find("area.down").click(cupboardSpinAreaDownOnClick);
}

function cupboardSpinAreaUpOnClick() {
	var input = $(this).parents("div.field").find("input");
	var offset = input.hasClass("step10") ? 10 : 1;
	input.val(parseInt(input.val()) + offset);
	input.change();
}

function cupboardSpinAreaDownOnClick() {
	var input = $(this).parents("div.field").find("input");
	if (input.val() > 0) {
		var offset = input.hasClass("step10") ? 10 : 1;
		input.val(input.val() - offset);
		input.change();
	}
}

// // // // // // // // // // // // // // // // // // // // // // // // //

// ПОДСЧИТАТЬ

function cupboardCalculate() {
	var price = 0;
	var sizeh = cupboard.params.sizeh.val() / 100;
	var sizeg = cupboard.params.sizeg.val() / 100;
	var sizew = cupboard.sizew.text() / 100;
	var material = cupboard.params.material.val();
	material = cupboard.prices.materials[material];
	var wallleft = cupboard.params.wallleft.attr("checked");
	var wallright = cupboard.params.wallright.attr("checked");
	var walltop = cupboard.params.walltop.attr("checked");
	var walllower = cupboard.params.walllower.attr("checked");
	var wallback = cupboard.params.wallback.attr("checked");
	// СТЕНКИ
	if (wallleft) price += sizeh * sizeg * material;
	if (wallright) price += sizeh * sizeg * material;
	if (walltop) price += sizew * sizeg * material;
	if (walllower) price += sizew * sizeg * material;
	// ЗАДНЯЯ СТЕНКА ОРГАЛИТ
	if (wallback) price += sizew * sizeh * 320;
	// ФАЛЬШПАНЕЛИ
	if (!wallleft) price += 350;
	if (!wallright) price += 350;
	if (!walltop) price += 350;
	if (!walllower) price += 350;
	// ДВЕРИ
	var doorborder = cupboard.params.doorborder.val();
	var doors = $("div.cupboard-control-doors div.door-pane-update");
	var doorwidth = sizew / doors.size();
	doors = doors.get();
	for (var i = 0; i < doors.length; i++) {
		var door = doors[i];
		// Взять номер наполнения
		var filler = $(door).find("select.filler").val();
		// Определить мдф-ность двери
		if ($(door).find("input.mdf").attr("checked")) {
			// МДФ дверь
			// Получить цену МДФ за квадратный метр
			filler = cupboard.prices.mdffillers[filler];
			// Получить цену двери
			price += sizeh * doorwidth * filler;
		} else {
			// Не МДФ
			// Получить округленную цену
			candoorwidth = getCanonicalDoorWidth(doorwidth * 1000);
			// Получить цену двери
			price += cupboard.prices.doors[candoorwidth + "/" + filler + "/" + doorborder];
		}
	}
	// СЕКЦИИ: ПОЛКИ, КОРЗИНЫ/ЯЩИКИ, ВЕШАЛКИ, ПЕРЕГОРОДКИ
	var section = cupboard.first;
	while (section) {
		// Полки
		price += sizeg * (section.width / 100) * material * section.pans;
		// Корзина (1) или ящик (2)
		if (section.baskets) price += section.baskets * ((section.basket == 1) ? 950 : 900);
		// Вешалки: торцевая (1) или штанга (2)
		if (section.hanger) price += (section.hanger == 1) ? (230 + 80) : 250;
		// Перегородка
		if (section.next) price += sizeh * sizeg * material;
		// Следующая секция
		section = section.next;
	}
	// НАКРУТКА
	price += price * 0.03;
	// Окончательная цена - выводим
	cupboard.price.text(Math.round(price));
}

// // // // // // // // // // // // // // // // // // // // // // // // //

// ПЕЧАТЬ

function cupboardPrint() {
	// Обязательные действия
	var print = $("div.cupboard-print");
	$("body > div.container").hide();
	$("body > div.sidebar").hide();
	$("body > div.footer").hide();
	// Перетащить шкаф
	$("div.cupboard").appendTo($("div.body div.image", print));
	// Инициализация один раз
	if (!cupboard.print) {
		cupboard.print = true;
		cupboardPrintInit(print);
	}
	// Подготовка таблиц
	cupboardPrintPrepareTables(print);
	// Показать страницу печати
	print.show();
}

function cupboardPrintInit(print) {
	// Кнопки
	var buttons = {
		toprint: $("button.toprint", print),
		tocalc: $("button.tocalc", print)
	}
	// Обработка кнопки печать
	buttons.toprint.click(function(){
		window.print();
	});
	// Обработка возврата
	buttons.tocalc.click(function(){
		$("div.body div.tables *").remove();
		$("div.cupboard-print").hide();
		$("body > div.container").show();
		$("body > div.sidebar").show();
		$("body > div.footer").show();
		$("div.cupboard").appendTo($("div.cupboard-brace"));
	});
	// Инструкции для разных броузеров
	if ($.browser.msie) { $("span.browser", print).hide(); $("span.msie", print).show(); }
	if ($.browser.opera) { $("span.browser", print).hide(); $("span.opera", print).show(); }
}

function cupboardPrintPrepareTables(print) {
	var tables = $("div.body div.tables", print);
	// Основные параметры
	var common = $("<p class='common'></p>").appendTo(tables);
	var wallleft = cupboard.params.wallleft.attr("checked");
	var wallright = cupboard.params.wallright.attr("checked");
	var walltop = cupboard.params.walltop.attr("checked");
	var walllower = cupboard.params.walllower.attr("checked");
	var wallback = cupboard.params.wallback.attr("checked");
	var sizew = cupboard.sizew.text();
	var sizeh = cupboard.params.sizeh.val();
	var sizeg = cupboard.params.sizeg.val();
	var doorborder = cupboard.params.doorborder;
	doorborder = doorborder.find("option[value='" + doorborder.val() + "']").text();
	var material = cupboard.params.material;
	material = material.find("option[value='" + material.val() + "']").text();
	common.append("<b>Размеры шкафа:</b> " + sizew + " x " + sizeh + " x " + sizeg + " см.<br>");
	common.append("<b>Материал:</b> " + material + "<br>");
	common.append("<b>Рамка дверей:</b> " + doorborder + "<br>");
	var walls = (wallleft) ? "Левая" : "";
	walls += (wallright) ? " Правая" : " ";
	walls += (walltop) ? " Верхняя" : " ";
	walls += (walllower) ? " Нижняя" : " ";
	walls += (wallback) ? " Задняя" : " ";
	common.append("<b>Стенки:</b> " + walls + "<br>");
	// Секции
	$("<h2>Секции:</h2>").appendTo(tables);
	var tablesections = $("<table class='sections data layout'><tbody></tbody></table>").appendTo(tables).find("tbody");
	var section = cupboard.first;
	var j = 1;
	while (section) {
		// Полки
		var pans = "Полки: " + section.pans + " шт.";
		if (!section.pans) pans = "&nbsp;";
		// Корзина или ящик
		var basket = $("div.cupboard-clones div.section-pane-update select.basket");
		basket = basket.find("option[value='" + section.basket + "']").text();
		basket = basket + ": " + section.baskets + " шт.";
		if (!section.basket) basket = "&nbsp;";
		// Вешалки: торцевая (1) или штанга (2)
		var hanger = $("div.cupboard-clones div.section-pane-update select.hanger");
		hanger = hanger.find("option[value='" + section.hanger + "']").text();
		hanger = "Вешалка: " + hanger;
		if (!section.hanger) hanger = "&nbsp;";
		// Печать
		tablesections.append("\
			<tr>\
				<td>Секция № " + j++ + " " + "</td>\
				<td>" + section.width + " см.</td>\
				<td>" + pans + "</td>\
				<td>" + basket + "</td>\
				<td>" + hanger + "</td>\
			</tr>\
		");
		// Следующая секция
		section = section.next;
	}
	// Двери
	$("<h2>Двери:</h2>").appendTo(tables);
	var tabledoors = $("<table class='doors data layout'><tbody></tbody></table>").appendTo(tables).find("tbody");
	var doors = $("div.cupboard-control-doors div.door-pane-update");
	var doorwidth = sizew / doors.size();
	doors = doors.get();
	for (var i = 0; i < doors.length; i++) {
		var door = doors[i];
		// Наполнение двери
		var filler = $(door).find("select.filler");
		filler = filler.find("option[value='" + filler.val() + "']").text();
		// МДФность
		var mdf = $(door).find("input.mdf").attr("checked") ? "МДФ" : "&nbsp;";
		// Печать
		tabledoors.append("\
			<tr>\
				<td>Дверь № " + ( i + 1 ) + " " + "</td>\
				<td>" + mdf + "</td>\
				<td>" + doorwidth + " см.</td>\
				<td>Наполнение: " + filler + "</td>\
			</tr>\
		");
	}
	// Цена
	var price = $("<p class='price'></p>").appendTo(tables);
	price.text("Цена: " + cupboard.price.text() + " руб.");
}

// // // // // // // // // // // // // // // // // // // // // // // // //

// ПАРАМЕТРЫ

function getCanonicalDoorWidth(width) {
	if (width <= 450) return 450;
	if (width <= 600) return 600;
	if (width <= 700) return 700;
	if (width <= 800) return 800;
	if (width <= 900) return 900;
	return 1000;
}

// Цена материала за квадратный метр
function getPriceMaterials() {
	var result = new Array();
	result[10] = 1050;
	result[20] = 1450;
	return result;
}

function getTableMdfFillers() {
	var result = new Array();
	result.push({ id: 10, label: "ЛДСП" });
	result.push({ id: 20, label: "Стекло" });
	result.push({ id: 30, label: "Зеркало" });
	result.push({ id: 40, label: "Стекло-Тонированное" });
	result.push({ id: 50, label: "Зеркало-Тонированное" });
	result.push({ id: 60, label: "Стекло-Матовое" });
	result.push({ id: 70, label: "РАТТАН" });
	return result;
}

function getPriceMdfFillers() {
	var result = new Array();
	result[10] = 3600;
	result[20] = 4250;
	result[30] = 4250;
	result[40] = 4250;
	result[50] = 4450;
	result[60] = 4850;
	result[70] = 7000;
	return result;
}

// Наполнение
function getTableFillers() {
	var result = new Array();
	result.push({ id: 10, label: "ЛДСП склад" });
	result.push({ id: 20, label: "ЛДСП заказ" });
	result.push({ id: 30, label: "Зеркало" });
	result.push({ id: 40, label: "Зеркало бр, гр, зел." });
	result.push({ id: 50, label: "Стекло" });
	result.push({ id: 60, label: "Стекло бр" });
	result.push({ id: 70, label: "Стекло мат" });
	return result;
}

// Рамка
function getTableDoorBorders() {
	var result = new Array();
	result.push({ id: 10, label: "Сталь Коммандор (однотонный)" });
	result.push({ id: 20, label: "Сталь Коммандор (под дерево)" });
	result.push({ id: 30, label: "Алюминий Раумплюс (однотонный)" });
	result.push({ id: 40, label: "Алюминий Раумплюс (под дерево)" });
	return result;
}

// Ширина/наполнение/рамка
function getPriceDoors() {
	var result = new Array();

result["450/10/10"] = 	3400	;
result["450/20/10"] = 	3750	;
result["450/30/10"] = 	3800	;
result["450/40/10"] = 	3950	;
result["450/50/10"] = 	3750	;
result["450/60/10"] = 	3800	;
result["450/70/10"] = 	6350	;
		
result["600/10/10"] = 	3800	;
result["600/20/10"] = 	4200	;
result["600/30/10"] = 	4300	;
result["600/40/10"] = 	4700	;
result["600/50/10"] = 	4200	;
result["600/60/10"] = 	4300	;
result["600/70/10"] = 	7300	;
		
result["700/10/10"] = 	3900	;
result["700/20/10"] = 	4300	;
result["700/30/10"] = 	4400	;
result["700/40/10"] = 	4900	;
result["700/50/10"] = 	4300	;
result["700/60/10"] = 	4400	;
result["700/70/10"] = 	8200	;
		
result["800/10/10"] = 	4000	;
result["800/20/10"] = 	4400	;
result["800/30/10"] = 	4550	;
result["800/40/10"] = 	5200	;
result["800/50/10"] = 	4450	;
result["800/60/10"] = 	4550	;
result["800/70/10"] = 	8650	;
		
result["900/10/10"] = 	4150	;
result["900/20/10"] = 	4700	;
result["900/30/10"] = 	4800	;
result["900/40/10"] = 	5700	;
result["900/50/10"] = 	4700	;
result["900/60/10"] = 	4850	;
result["900/70/10"] = 	9600	;
		
result["1000/10/10"] = 	4400	;
result["1000/20/10"] = 	4900	;
result["1000/30/10"] = 	5050	;
result["1000/40/10"] = 	5850	;
result["1000/50/10"] = 	4950	;
result["1000/60/10"] = 	5150	;
result["1000/70/10"] = 	10200	;

//

result["450/10/20"] = 	3900	;
result["450/20/20"] = 	4200	;
result["450/30/20"] = 	4250	;
result["450/40/20"] = 	4450	;
result["450/50/20"] = 	4200	;
result["450/60/20"] = 	4250	;
result["450/70/20"] = 	7100	;
		
result["600/10/20"] = 	4250	;
result["600/20/20"] = 	4750	;
result["600/30/20"] = 	4800	;
result["600/40/20"] = 	5200	;
result["600/50/20"] = 	4750	;
result["600/60/20"] = 	4800	;
result["600/70/20"] = 	8250	;
		
result["700/10/20"] = 	4500	;
result["700/20/20"] = 	5000	;
result["700/30/20"] = 	5050	;
result["700/40/20"] = 	5700	;
result["700/50/20"] = 	5000	;
result["700/60/20"] = 	5050	;
result["700/70/20"] = 	9050	;
		
result["800/10/20"] = 	4650	;
result["800/20/20"] = 	5150	;
result["800/30/20"] = 	5250	;
result["800/40/20"] = 	6000	;
result["800/50/20"] = 	5200	;
result["800/60/20"] = 	5250	;
result["800/70/20"] = 	9700	;
		
result["900/10/20"] = 	4850	;
result["900/20/20"] = 	5350	;
result["900/30/20"] = 	5450	;
result["900/40/20"] = 	6550	;
result["900/50/20"] = 	5400	;
result["900/60/20"] = 	5450	;
result["900/70/20"] = 	10550	;
		
result["1000/10/20"] = 	5000	;
result["1000/20/20"] = 	5550	;
result["1000/30/20"] = 	5800	;
result["1000/40/20"] = 	6650	;
result["1000/50/20"] = 	5750	;
result["1000/60/20"] = 	5800	;
result["1000/70/20"] = 	11350	;


//

result["450/10/30"] = 	4700	;
result["450/20/30"] = 	5000	;
result["450/30/30"] = 	5050	;
result["450/40/30"] = 	5200	;
result["450/50/30"] = 	5000	;
result["450/60/30"] = 	5050	;
result["450/70/30"] = 	7650	;
		
result["600/10/30"] = 	5300	;
result["600/20/30"] = 	5500	;
result["600/30/30"] = 	5700	;
result["600/40/30"] = 	6100	;
result["600/50/30"] = 	5500	;
result["600/60/30"] = 	5600	;
result["600/70/30"] = 	8900	;
		
result["700/10/30"] = 	5500	;
result["700/20/30"] = 	5850	;
result["700/30/30"] = 	5900	;
result["700/40/30"] = 	6450	;
result["700/50/30"] = 	5850	;
result["700/60/30"] = 	5900	;
result["700/70/30"] = 	9650	;
		
result["800/10/30"] = 	5700	;
result["800/20/30"] = 	6000	;
result["800/30/30"] = 	6100	;
result["800/40/30"] = 	6800	;
result["800/50/30"] = 	6100	;
result["800/60/30"] = 	6050	;
result["800/70/30"] = 	10250	;
		
result["900/10/30"] = 	5700	;
result["900/20/30"] = 	6250	;
result["900/30/30"] = 	6300	;
result["900/40/30"] = 	7150	;
result["900/50/30"] = 	6250	;
result["900/60/30"] = 	6300	;
result["900/70/30"] = 	11400	;
		
result["1000/10/30"] = 	5900	;
result["1000/20/30"] = 	6550	;
result["1000/30/30"] = 	6600	;
result["1000/40/30"] = 	7250	;
result["1000/50/30"] = 	6550	;
result["1000/60/30"] = 	6600	;
result["1000/70/30"] = 	11600	;

//	
	
result["450/10/40"] = 	5700	;
result["450/20/40"] = 	5900	;
result["450/30/40"] = 	5850	;
result["450/40/40"] = 	6050	;
result["450/50/40"] = 	5800	;
result["450/60/40"] = 	5850	;
result["450/70/40"] = 	9300	;
		
result["600/10/40"] = 	6050	;
result["600/20/40"] = 	6350	;
result["600/30/40"] = 	6450	;
result["600/40/40"] = 	7000	;
result["600/50/40"] = 	6350	;
result["600/60/40"] = 	6450	;
result["600/70/40"] = 	10450	;
		
result["700/10/40"] = 	6300	;
result["700/20/40"] = 	6800	;
result["700/30/40"] = 	6900	;
result["700/40/40"] = 	7450	;
result["700/50/40"] = 	6850	;
result["700/60/40"] = 	6900	;
result["700/70/40"] = 	11250	;
		
result["800/10/40"] = 	6450	;
result["800/20/40"] = 	6950	;
result["800/30/40"] = 	7000	;
result["800/40/40"] = 	7900	;
result["800/50/40"] = 	6950	;
result["800/60/40"] = 	7000	;
result["800/70/40"] = 	12150	;
		
result["900/10/40"] = 	6600	;
result["900/20/40"] = 	7250	;
result["900/30/40"] = 	7300	;
result["900/40/40"] = 	8250	;
result["900/50/40"] = 	7250	;
result["900/60/40"] = 	7300	;
result["900/70/40"] = 	12650	;
		
result["1000/10/40"] = 	6800	;
result["1000/20/40"] = 	7600	;
result["1000/30/40"] = 	7900	;
result["1000/40/40"] = 	8400	;
result["1000/50/40"] = 	7650	;
result["1000/60/40"] = 	7700	;
result["1000/70/40"] = 	13400	;

	return result;
}