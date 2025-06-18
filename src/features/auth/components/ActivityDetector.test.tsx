import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { updateLastActivity } from '../authSlice';
import ActivityDetector from './ActivityDetector';

describe('ActivityDetector', () => {
    let store: ReturnType<typeof configureStore>;
    let dispatchSpy: any;

    beforeEach(() => {
        store = configureStore({ reducer: { auth: authReducer } });
        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('adds event listeners on mount', () => {
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

        render(
            <Provider store={store}>
                <ActivityDetector />
            </Provider>
        );

        const events = [
            'pointermove',
            'pointerdown',
            'pointerup',
            'keydown',
            'wheel',
            'scroll',
            'input',
            'focus',
            'visibilitychange',
        ];

        events.forEach((event) => {
            expect(addEventListenerSpy).toHaveBeenCalledWith(
                event,
                expect.any(Function),
                { passive: true }
            );
        });
        expect(addEventListenerSpy).toHaveBeenCalledTimes(events.length);
    });

    it('removes event listeners on unmount', () => {
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

        const { unmount } = render(
            <Provider store={store}>
                <ActivityDetector />
            </Provider>
        );

        unmount();

        const events = [
            'pointermove',
            'pointerdown',
            'pointerup',
            'keydown',
            'wheel',
            'scroll',
            'input',
            'focus',
            'visibilitychange',
        ];

        events.forEach((event) => {
            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                event,
                expect.any(Function)
            );
        });
        expect(removeEventListenerSpy).toHaveBeenCalledTimes(events.length);
    });

    it('dispatches updateLastActivity action for pointerdown event', () => {
        render(
            <Provider store={store}>
                <ActivityDetector />
            </Provider>
        );

        fireEvent.pointerDown(window);

        expect(dispatchSpy).toHaveBeenCalledWith(
            updateLastActivity({
                eventType: 'pointerdown',
                timestamp: expect.any(Number),
            })
        );
    });

    it('dispatches updateLastActivity action for focus event without pointermove', () => {
        render(
            <Provider store={store}>
                <ActivityDetector />
            </Provider>
        );

        const input = document.createElement('input');
        document.body.appendChild(input);
        fireEvent.focus(window);

        expect(dispatchSpy).toHaveBeenCalledWith(
            updateLastActivity({
                eventType: 'focus',
                timestamp: expect.any(Number),
            })
        );

        document.body.removeChild(input);
    });

});
