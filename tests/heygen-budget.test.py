import importlib.util, unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('heygen_clips',Path(__file__).parents[1]/'scripts/heygen-clips.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class BudgetTests(unittest.TestCase):
 def ledger(self):return {'planningBRLPerUSD':7,'limitBRL':100,'pricingBasis':'Explicit estimate fixture','jobs':[]}
 def test_unknown_and_failed_charges_keep_reservation(self):
  d=self.ledger();d['jobs']=[{'reservedUSD':14,'chargedUSD':None,'status':'submission_unknown'}]
  with self.assertRaises(ValueError):m.check_budget(d,1)
  d['jobs'][0]['status']='failed'
  with self.assertRaises(ValueError):m.check_budget(d,1)
 def test_verified_charge_releases_estimate(self):
  d=self.ledger();d['jobs']=[{'reservedUSD':14,'chargedUSD':.4}];self.assertEqual(m.check_budget(d,2),m.Decimal('.4'))
 def test_missing_pricing_and_negative_budget_rejected(self):
  for field,value in [('pricingBasis',''),('limitBRL',0),('planningBRLPerUSD',-1)]:
   d=self.ledger();d[field]=value
   with self.assertRaises(ValueError):m.check_budget(d,1)
 def test_unsupported_media_mode_does_not_submit(self):
  with self.assertRaises(ValueError):m.payload_for({'model':'heygen-video-1','duration':10,'mode':'reference_to_video'},Path('.'))
if __name__=='__main__':unittest.main()
