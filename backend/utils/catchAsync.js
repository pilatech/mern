function catchAsync(fn){
    return function(req, res, next){
      fn(req, res).catch(next)
    }
  }

module.exports = catchAsync