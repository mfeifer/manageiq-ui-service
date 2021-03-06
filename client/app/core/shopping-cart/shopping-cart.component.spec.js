/* global $componentController, ShoppingCart, EventNotifications */
/* eslint-disable no-unused-expressions */
describe('Component: shoppingCart', () => {
  let ctrl, closeFn, successNotificationSpy, failureNotificationSpy
  beforeEach(() => {
    module('app.core')
    bard.inject('$componentController', 'EventNotifications', 'ShoppingCart', '$state')

    const modalInstance = {
      close: () => {}
    }
    closeFn = sinon.stub(modalInstance, 'close').returns(true)
    successNotificationSpy = sinon.spy(EventNotifications, 'success')
    failureNotificationSpy = sinon.spy(EventNotifications, 'error')
    ctrl = $componentController('shoppingCart', {}, {
      modalInstance: modalInstance,
    })
  })

  it('is defined', () => {
    expect(ctrl).to.be.defined
  })

  it('should handle refreshing state', () => {
    const stateSpy = sinon.stub(ShoppingCart, 'state').returns(true)
    ctrl.$doCheck()

    expect(stateSpy).to.have.been.called.once
  })

  it('should able to be submitted successfully', (done) => {
    const submitSpy = sinon.stub(ShoppingCart, 'submit').returns(Promise.resolve({'status': 'success'}))
    ctrl.submit().then(() => {
      done()

      expect(submitSpy).to.have.been.called.once
      expect(closeFn).to.have.been.called.once
      expect(successNotificationSpy).to.have.been.calledWith('Shopping cart successfully ordered')
    })
  })

  it('should able to be submitted and fail', (done) => {
    sinon.stub(ShoppingCart, 'submit').returns(Promise.reject(new Error('failure')))
    ctrl.submit().then(() => {
      done()

      expect(failureNotificationSpy).to.have.been.calledWith('There was an error submitting this request: failure')
    })
  })

  it('should allow a shopping cart modal to be closed', () => {
    ctrl.close()
    expect(closeFn).to.have.been.called.once
  })
})
