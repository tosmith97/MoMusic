from .. import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
    phone_number = db.Column(db.String)  

    # @property
    # def phone_numbers(self):
    #     return [(x) for x in self._phone_numbers.split(';')]
    # @phone_numbers.setter
    # def ratings(self, pn):
    #     self._phone_numbers += ';%s' % pn

    # def __repr__(self):
    #     return '<Call \'%s\'>' % self.call_uuid