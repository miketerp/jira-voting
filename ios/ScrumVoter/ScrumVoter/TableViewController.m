//
//  UIViewController+TableController.m
//  ScrumVoter
//
//  Created by Bane on 2017-03-30.
//  Copyright (c) 2017 GroupBy Inc. All rights reserved.
//

#import "TableViewController.h"
#import "VoteViewController.h"

@implementation TableViewController
{
    NSArray *tableData;
//    NSInteger index;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Initialize table data
    tableData = [NSArray arrayWithObjects:@"Searchendiser", @"SRE", @"Storefront", @"Wisdom", @"Shopping Cart", nil];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [tableData count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *simpleTableIdentifier = @"SimpleTableItem";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:simpleTableIdentifier];
    
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:simpleTableIdentifier];
    }
    
    cell.textLabel.text = [tableData objectAtIndex:indexPath.row];
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
//    index = indexPath.row;
    [self performSegueWithIdentifier:@"voteTransition" sender:self];
    
}

//- (void)prepareForSegue:(UIStoryboardSegue *)segue
//                 sender:(id)sender {
//    // Make sure your segue name in storyboard is the same as this line
//    if ([[segue identifier] isEqualToString:@"voteTransition"])
//    {
//        // Get reference to the destination view controller
//        VoteViewController *vc = [segue destinationViewController];
//        
//        // Pass any objects to the view controller here, like...
//        [vc setNamespacewithValue:&(index)];
//    }
//}

@end
