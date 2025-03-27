const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema({
  id_book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  id_borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  borrow_date: {
    type: Date,
    default: Date.now,
  },
  due_date: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 hari dari sekarang
    },
  },
  return_date: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["reserved", "borrowed", "returned", "overdue", "canceled"],
    default: "reserved",
  },
});

// Middleware untuk update status jika sudah overdue
borrowedBookSchema.pre("save", function (next) {
  if (!this.return_date && new Date() > this.due_date) {
    this.status = "overdue";
  }
  next();
});

module.exports = mongoose.model("BorrowedBook", borrowedBookSchema);
