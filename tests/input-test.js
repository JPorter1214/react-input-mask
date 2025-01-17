import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const Input = require('../InputElement');

document.body.innerHTML = '<div id="container"></div>';
const container = document.getElementById('container');;

function createInput(component, cb) {
    return (done) => {
        ReactDOM.unmountComponentAtNode(container);
        var input = ReactDOM.render(component, container);

        // IE can fail if executed synchronously
        setImmediate(() => {
            cb(input);
            done();
        });
    };
};

describe('Input', () => {
    it('Init format', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue="74953156454" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        expect(inputNode.value).toEqual('+7 (495) 315 64 54');
    }));

    it('Format unacceptable string', createInput(
        <Input mask="+7 (9a9) 999 99 99" defaultValue="749531b6454" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        expect(inputNode.value).toEqual('+7 (4b6) 454 __ __');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Focus/blur', createInput(
        <Input mask="+7 (*a9) 999 99 99" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        expect(inputNode.value).toEqual('');

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);
        expect(inputNode.value).toEqual('+7 (___) ___ __ __');

        inputNode.blur();
        TestUtils.Simulate.blur(inputNode);
        expect(inputNode.value).toEqual('');

        input.setProps({ value: '+7 (___) ___ __ __' });
        expect(inputNode.value).toEqual('');

        input.setProps({ value: '+7 (1__) ___ __ __' });
        expect(inputNode.value).toEqual('+7 (1__) ___ __ __');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('alwaysShowMask', createInput(
        <Input mask="+7 (999) 999 99 99" alwaysShowMask />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        expect(inputNode.value).toEqual('+7 (___) ___ __ __');

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);
        expect(inputNode.value).toEqual('+7 (___) ___ __ __');

        inputNode.blur();
        TestUtils.Simulate.blur(inputNode);
        expect(inputNode.value).toEqual('+7 (___) ___ __ __');

        input.setProps({ alwaysShowMask: false });
        expect(inputNode.value).toEqual('');

        input.setProps({ alwaysShowMask: true });
        expect(inputNode.value).toEqual('+7 (___) ___ __ __');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Focus cursor position', createInput(
        <Input mask="+7 (999) 999 99 99" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        expect(input.getCaretPos()).toEqual(4);

        inputNode.blur();
        TestUtils.Simulate.blur(inputNode);

        input.setProps({ value: '+7 (___) ___ _1 __' });
        input.setCaretPos(2);
        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);
        expect(input.getCaretPos()).toEqual(16);

        inputNode.blur();
        TestUtils.Simulate.blur(inputNode);

        input.setProps({ value: '+7 (___) ___ _1 _1' });
        input.setCaretPos(2);
        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);
        expect(input.getCaretPos()).toEqual(2);

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Characters input', createInput(
        <Input mask="+7 (*a9) 999 99 99" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setCaretPos(0);
        TestUtils.Simulate.keyPress(inputNode, { key: 'E' });
        expect(inputNode.value).toEqual('+7 (E__) ___ __ __');

        TestUtils.Simulate.keyPress(inputNode, { key: '6' });
        expect(inputNode.value).toEqual('+7 (E__) ___ __ __');

        TestUtils.Simulate.keyPress(inputNode, { key: 'x' });
        expect(inputNode.value).toEqual('+7 (Ex_) ___ __ __');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Characters input without maskChar', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue={"+7 (111) 123 45 6"} maskChar={null} />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setCaretPos(4);
        TestUtils.Simulate.keyPress(inputNode, { key: 'E' });
        expect(inputNode.value).toEqual('+7 (111) 123 45 6');

        TestUtils.Simulate.keyPress(inputNode, { key: '6' });
        expect(inputNode.value).toEqual('+7 (611) 112 34 56');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Backspace single character', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue="74953156454" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setCaretPos(10);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Backspace' });
        expect(inputNode.value).toEqual('+7 (495) _15 64 54');
        
        TestUtils.Simulate.keyDown(inputNode, { key: 'Backspace' });
        expect(inputNode.value).toEqual('+7 (49_) _15 64 54');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Backspace single character without maskChar', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue="74953156454" maskChar={null} />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setCaretPos(10);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Backspace' });
        expect(inputNode.value).toEqual('+7 (495) 156 45 4');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Backspace single character cursor position', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue="74953156454" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setCaretPos(10);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Backspace' });
        expect(input.getCaretPos()).toEqual(9);

        TestUtils.Simulate.keyDown(inputNode, { key: 'Backspace' });
        expect(input.getCaretPos()).toEqual(6);

        input.setCaretPos(4);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Backspace' });
        expect(input.getCaretPos()).toEqual(4);

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Backspace range', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue="74953156454" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setSelection(1, 9);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Backspace' });
        expect(inputNode.value).toEqual('+7 (___) _15 64 54');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Backspace range cursor position', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue="74953156454" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setSelection(1, 9);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Backspace' });
        expect(input.getCaretPos()).toEqual(1);

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Delete single character', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue="74953156454" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setCaretPos(0);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Delete' });
        expect(inputNode.value).toEqual('+7 (495) 315 64 54');

        input.setCaretPos(7);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Delete' });
        expect(inputNode.value).toEqual('+7 (495) _15 64 54');

        input.setCaretPos(11);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Delete' });
        expect(inputNode.value).toEqual('+7 (495) _1_ 64 54');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Delete single character cursor position', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue="74953156454" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setCaretPos(0);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Delete' });
        expect(input.getCaretPos()).toEqual(4);

        input.setCaretPos(7);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Delete' });
        expect(input.getCaretPos()).toEqual(9);

        input.setCaretPos(11);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Delete' });
        expect(input.getCaretPos()).toEqual(11);

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Delete range', createInput(
        <Input mask="+7 (999) 999 99 99" defaultValue="74953156454" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setSelection(1, 9);
        TestUtils.Simulate.keyDown(inputNode, { key: 'Delete' });
        expect(inputNode.value).toEqual('+7 (___) _15 64 54');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Mask change', createInput(
        <Input mask="9999-9999-9999-9999" defaultValue="34781226917" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        input.setProps({ mask: "9999-999999-99999" });
        expect(inputNode.value).toEqual('3478-122691-7____');

        input.setProps({ mask: "9-9-9-9" });
        expect(inputNode.value).toEqual('3-4-7-8');

        input.setProps({ mask: null });
        expect(inputNode.value).toEqual('34781226917');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Paste string', createInput(
        <Input mask="9999-9999-9999-9999" defaultValue="____-____-____-6543" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setSelection(3, 15);
        input.pasteText(inputNode.value, '34781226917', input.getSelection());
        expect(inputNode.value).toEqual('___3-4781-2269-17_3');

        input.setCaretPos(3);
        input.pasteText(inputNode.value, '3-__81-2_6917', input.getSelection());
        expect(inputNode.value).toEqual('___3-__81-2_69-17_3');

        ReactDOM.unmountComponentAtNode(container);
    }));

    it('Paste string without maskChar', createInput(
        <Input mask="9999-9999-9999-9999" defaultValue="9999-9999-9999-9999" maskChar={null} />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);

        inputNode.focus();
        TestUtils.Simulate.focus(inputNode);

        input.setSelection(0, 19);
        input.pasteText(inputNode.value, '34781226917', input.getSelection());
        expect(inputNode.value).toEqual('3478-1226-917');

        input.setCaretPos(1);
        input.pasteText(inputNode.value, '12345', input.getSelection());
        expect(inputNode.value).toEqual('3123-4547-8122-6917');

        input.setCaretPos(1);
        input.pasteText(inputNode.value, '4321', input.getSelection());
        expect(inputNode.value).toEqual('3432-1547-8122-6917');

        ReactDOM.unmountComponentAtNode(container);
    }));
});
