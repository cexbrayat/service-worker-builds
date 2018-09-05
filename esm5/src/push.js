/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { NEVER, Subject, merge } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * \@experimental
 */
var SwPush = /** @class */ (function () {
    function SwPush(sw) {
        this.sw = sw;
        this.subscriptionChanges = new Subject();
        if (!sw.isEnabled) {
            this.messages = NEVER;
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map(function (message) { return message.data; }));
        this.pushManager = this.sw.registration.pipe(map(function (registration) { return registration.pushManager; }));
        /** @type {?} */
        var workerDrivenSubscriptions = this.pushManager.pipe(switchMap(function (pm) { return pm.getSubscription().then(function (sub) { return sub; }); }));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    Object.defineProperty(SwPush.prototype, "isEnabled", {
        /**
         * Returns true if the Service Worker is enabled (supported by the browser and enabled via
         * ServiceWorkerModule).
         */
        get: /**
         * Returns true if the Service Worker is enabled (supported by the browser and enabled via
         * ServiceWorkerModule).
         * @return {?}
         */
        function () { return this.sw.isEnabled; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @return {?}
     */
    SwPush.prototype.requestSubscription = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        var pushOptions = { userVisibleOnly: true };
        /** @type {?} */
        var key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        /** @type {?} */
        var applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (var i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        return this.pushManager.pipe(switchMap(function (pm) { return pm.subscribe(pushOptions); }), take(1))
            .toPromise()
            .then(function (sub) {
            _this.subscriptionChanges.next(sub);
            return sub;
        });
    };
    /**
     * @return {?}
     */
    SwPush.prototype.unsubscribe = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        var doUnsubscribe = function (sub) {
            if (sub === null) {
                throw new Error('Not subscribed to push notifications.');
            }
            return sub.unsubscribe().then(function (success) {
                if (!success) {
                    throw new Error('Unsubscribe failed!');
                }
                _this.subscriptionChanges.next(null);
            });
        };
        return this.subscription.pipe(take(1), switchMap(doUnsubscribe)).toPromise();
    };
    /**
     * @param {?} input
     * @return {?}
     */
    SwPush.prototype.decodeBase64 = /**
     * @param {?} input
     * @return {?}
     */
    function (input) { return atob(input); };
    SwPush.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SwPush.ctorParameters = function () { return [
        { type: NgswCommChannel }
    ]; };
    return SwPush;
}());
export { SwPush };
if (false) {
    /** @type {?} */
    SwPush.prototype.messages;
    /** @type {?} */
    SwPush.prototype.subscription;
    /** @type {?} */
    SwPush.prototype.pushManager;
    /** @type {?} */
    SwPush.prototype.subscriptionChanges;
    /** @type {?} */
    SwPush.prototype.sw;
}
//# sourceMappingURL=push.js.map